import {
  composeContext,
  elizaLogger,
  generateObjectDeprecated,
  type HandlerCallback,
  ModelClass,
  type IAgentRuntime,
  type Memory,
  type State,
} from '@elizaos/core';

import { getOnchainAsset } from '../utils/assets';
import { getTrnBalanceExamples } from '../examples/get-balance';
import { getTrnBalanceTemplate } from '../templates';
import { convertBigIntToDecimal, getApi } from '../utils/trn';
import { ApiPromise } from '@polkadot/api';
import { AccountAssetDetails, BalanceContent, FrameSystemAccountInfo } from '../types';

function isBalanceContent(runtime: IAgentRuntime, content: any): content is BalanceContent {
  elizaLogger.log('Content for balance', content);
  return (
    typeof content.address === 'string' && (typeof content.token === 'string' || typeof content.token === 'number')
  );
}

export const getBalanceAction = {
  name: 'getBalance',
  description: 'Get balance of a TRN asset for the given address',
  similes: ['GET_BALANCE', 'CHECK_BALANCE'],
  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    // Always return true for token transfers, letting the handler deal with specifics
    elizaLogger.log('Validating get balance from user:', message.userId);
    return true;
  },
  template: getTrnBalanceTemplate,
  examples: getTrnBalanceExamples,
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: Record<string, unknown>,
    callback?: HandlerCallback
  ) => {
    let currentState = state;
    if (!currentState) {
      currentState = (await runtime.composeState(message)) as State;
    } else {
      currentState = await runtime.updateRecentMessageState(currentState);
    }
    const network = process.env.PUBLIC_NETWORK_SET === 'mainnet' ? 'mainnet' : 'testnet';

    const getBalanceContext = composeContext({
      state: currentState,
      template: getTrnBalanceTemplate,
    });

    const content = await generateObjectDeprecated({
      runtime,
      context: getBalanceContext,
      modelClass: ModelClass.LARGE,
    });

    if (!isBalanceContent(runtime, content)) {
      if (callback) {
        callback({
          text: 'Address and token needed to get the balance.',
          content: { error: 'Invalid balance content' },
        });
      }
      return false;
    }

    const token = content.token!;
    const address = content.address!;

    try {
      const trnApi = await getApi(network);
      const api = trnApi as ApiPromise;

      const onchainAsset = await getOnchainAsset(api, token.toString());

      if (!onchainAsset) {
        const errorMsg = `Token '${token}' is not recognized on ${network}`;
        elizaLogger.error(errorMsg);
        callback?.({ text: errorMsg, content: { token, error: errorMsg } });
        return false;
      }

      let rawBalance: bigint;
      if (Number(onchainAsset.id) === 1) {
        const accountInfo = (await api.query.system.account(address)) as unknown as FrameSystemAccountInfo | null;
        if (!accountInfo) {
          callback?.({
            text: `No account info found for ${address}`,
            content: { address, token, balance: 0 },
          });
        }

        const bigIntFree = accountInfo?.data?.free || 0n;
        const bigIntMiscFrozen = accountInfo?.data?.miscFrozen || 0n;

        const bigIntBalance = BigInt(bigIntFree) - BigInt(bigIntMiscFrozen);
        rawBalance = bigIntBalance;
      } else {
        const result = (
          await trnApi.query.assets.account(Number(onchainAsset.id), address)
        ).toPrimitive() as unknown as AccountAssetDetails | null;
        if (!result) {
          callback?.({
            text: `No balance found for ${token} on TRN.`,
            content: { address, token, balance: 0 },
          });
          return false;
        }
        rawBalance = BigInt(result.balance);
      }

      callback?.({
        text: `${address} has ${convertBigIntToDecimal(rawBalance, 6)} ${token} on TRN.`,
        content: { address, token, balance: convertBigIntToDecimal(rawBalance, 6) },
      });

      return true;
    } catch (err) {
      const errorMessage = `Error getting balance for ${token} on TRN: ${err.message}`;
      elizaLogger.error(errorMessage);
      callback?.({
        text: errorMessage,
        content: {
          error: err.message,
          token,
        },
      });
      return false;
    }
  },
};
