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

import { getAssetBySymbol } from '../utils/assets';
import { getTrnBalanceExamples } from '../examples/get-balance';
import { getTrnBalanceTemplate } from '../templates';
import { getApi } from '../utils/trn';
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
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: Record<string, unknown>,
    callback?: HandlerCallback
  ) => {
    elizaLogger.log('Starting getBalance action...');

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
      const assetId = typeof token === 'string' ? await getAssetBySymbol(token, network) : token;
      if (!assetId) {
        const errorMsg = `Token '${token}' is not recognized on ${network}`;
        elizaLogger.error(errorMsg);
        callback?.({ text: errorMsg, content: { token, error: errorMsg } });
        return false;
      }
      const trnApi = await getApi(network);
      const api = trnApi as ApiPromise;

      let rawBalance: bigint;
      if (assetId === 1) {
        const accountInfo = (await api.query.system.account(address)) as unknown as FrameSystemAccountInfo | null;
        if (!accountInfo) {
          throw new Error(`No account info found for ${address}`);
        }

        const bigIntFree = accountInfo?.data?.free || 0n;
        const bigIntMiscFrozen = accountInfo?.data?.miscFrozen || 0n;

        const bigIntBalance = BigInt(bigIntFree - bigIntMiscFrozen);
        rawBalance = bigIntBalance;
      } else {
        const result = (
          await trnApi.query.assets.account(assetId, address)
        ).toPrimitive() as unknown as unknown as AccountAssetDetails | null;
        if (!result) {
          throw new Error(`No balance found for ${token} on TRN`);
        }
        rawBalance = BigInt(result.balance);
      }

      callback?.({
        text: `${address} has ${rawBalance} ${token} on TRN.`,
        content: { address, token, balance: rawBalance.toString() },
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
  template: getTrnBalanceTemplate,
  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    // Always return true for token transfers, letting the handler deal with specifics
    elizaLogger.log('Validating get balance from user:', message.userId);
    return true;
  },
  examples: getTrnBalanceExamples,
  similes: ['GET_BALANCE', 'CHECK_BALANCE'],
};
