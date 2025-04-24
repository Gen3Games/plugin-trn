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

import { convertDecimalToBigInt, getApi } from '../utils/trn';
import { getOnchainSymbol, getOnchainAssetId } from '../utils/assets';
import { sendTokenExamples } from '../examples/transfer-token';
import { initWalletProvider } from '../providers/wallet';
import { trnTransferTemplate } from '../templates';

function isTransferContent(content: any): content is {
  recipient: string;
  token: string | number;
  amount: string;
} {
  return (
    typeof content.recipient === 'string' &&
    (typeof content.token === 'string' || typeof content.token === 'number') &&
    typeof content.amount === 'string'
  );
}

export const sendTokenAction = {
  name: 'send_token',
  description: 'Send a token on The Root Network to a recipient',
  similes: ['SEND_TOKEN', 'TRANSFER_TOKEN'],
  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    elizaLogger.log('Validating send_token from user:', message.userId);
    return true;
  },
  template: trnTransferTemplate,
  examples: sendTokenExamples,
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

    const getTransferContext = composeContext({
      state: currentState,
      template: trnTransferTemplate,
    });

    const content = await generateObjectDeprecated({
      runtime,
      context: getTransferContext,
      modelClass: ModelClass.LARGE,
    });

    elizaLogger.info('Generated content for send_token', content);

    if (!isTransferContent(content)) {
      callback?.({
        text: 'Missing recipient, token, or amount to complete the transfer.',
        content: { error: 'Invalid send_token content' },
      });
      return false;
    }

    const token = content.token!;
    const recipient = content.recipient! as `0x${string}`;
    const amount = content.amount!;

    const network = process.env.PUBLIC_NETWORK_SET === 'mainnet' ? 'mainnet' : 'testnet';
    const api = await getApi(network);

    try {
      const onchainAsset =
        typeof token === 'string' ? await getOnchainSymbol(api, token) : await getOnchainAssetId(api, token);
      if (!onchainAsset) {
        const errorMsg = `Token '${content.token}' not recognized on TRN.`;
        elizaLogger.error(errorMsg);
        callback?.({
          text: errorMsg,
          content: { error: errorMsg },
        });
        return false;
      }

      const amountBigInt = convertDecimalToBigInt(amount, onchainAsset.decimals);
      const walletProvider = await initWalletProvider(runtime);
      await walletProvider.transfer(onchainAsset.id, recipient, amountBigInt.toString());
      callback?.({
        text: `Sent ${content.amount} ${content.token} to ${content.recipient}.`,
        content: {
          recipient: content.recipient,
          token: content.token,
          amount: content.amount,
        },
      });

      return true;
    } catch (err) {
      elizaLogger.error(`Error sending token: ${err.message}`);
      callback?.({
        text: `Transfer failed: ${err.message}`,
        content: { error: err.message },
      });
      return false;
    } finally {
      await api.disconnect();
    }
  },
};
