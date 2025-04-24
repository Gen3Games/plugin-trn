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

import { getApi } from '../utils/trn';
import { getTrnFuturePassTemplate } from '../templates';
import { getTrnFuturePassExamples } from '../examples/get-futurepass';

function isFuturePassContent(_runtime: IAgentRuntime, content: any): content is { address: string } {
  return typeof content?.address === 'string';
}

export const getFuturePassAction = {
  name: 'getFuturepass',
  description: 'Fetch the Futurepass address for a given wallet address',
  similes: ['FUTUREPASS_LOOKUP', 'GET_FUTUREPASS'],
  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    elizaLogger.log('Validating getFuturePass for user:', message.userId);
    return true;
  },
  template: getTrnFuturePassTemplate,
  examples: getTrnFuturePassExamples,
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: Record<string, unknown>,
    callback?: HandlerCallback
  ) => {
    let currentState = state ?? (await runtime.composeState(message));
    currentState = await runtime.updateRecentMessageState(currentState);

    const network = process.env.PUBLIC_NETWORK_SET === 'mainnet' ? 'mainnet' : 'testnet';
    const context = composeContext({
      state: currentState,
      template: getTrnFuturePassTemplate,
    });

    const content = await generateObjectDeprecated({
      runtime,
      context,
      modelClass: ModelClass.LARGE,
    });

    if (!isFuturePassContent(runtime, content)) {
      callback?.({
        text: 'Missing or invalid address for FuturePass lookup.',
        content: { error: 'Invalid content structure' },
      });
      return false;
    }

    const address = content.address === 'null' ? runtime.getSetting('TRN_PUBLIC_KEY') : content.address!;

    try {
      const trnApi = await getApi(network);
      const futurepassAddress = await trnApi.query.futurepass.holders(address);

      if (!futurepassAddress || futurepassAddress.isEmpty) {
        callback?.({
          text: `No Futurepass found for ${address}`,
          content: { address, futurepass: null },
        });
        return false;
      }

      const extracted = futurepassAddress.toString();

      callback?.({
        text: `Futurepass address is ${extracted}`,
        content: { address, futurepass: extracted },
      });

      return true;
    } catch (err: any) {
      const errorMessage = `Error getting FuturePass for ${address}: ${err.message}`;
      elizaLogger.error(errorMessage);
      callback?.({
        text: errorMessage,
        content: {
          error: err.message,
          address,
        },
      });
      return false;
    }
  },
};
