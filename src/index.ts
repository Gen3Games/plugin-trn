import { type Plugin } from '@elizaos/core';
import { getBalanceAction } from './actions/get-balance';
import { getFuturePassAction } from './actions/get-futurepass';

// import getTransaction from './actions/getTransaction';
// import sendTransaction from './actions/sendTransaction';

export const trnPlugin: Plugin = {
  name: '@elizaos-plugins/plugin-trn',
  description: 'Plugin for interacting with the TRN Chain',
  config: [],
  actions: [getBalanceAction, getFuturePassAction],
  providers: [],
  evaluators: [],
  services: [],
  clients: [],
  adapters: [],
};

export { trnPlugin as default };
