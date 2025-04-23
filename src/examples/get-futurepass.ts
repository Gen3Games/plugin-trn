import { ActionExample } from '@elizaos/core';

export const getTrnFuturePassExamples: ActionExample[][] = [
  [
    {
      user: '{{user1}}',
      content: {
        text: 'What is my FuturePass?',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll help you check your FuturePass",
        action: 'GET_FUTUREPASS',
        content: {
          address: '{{walletAddress}}',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Get FuturePass for 5Fh9D9cPZqkFjv5S4Zg4yD7K2Grzsy1YtFbcDzxBhfck9BkE',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll look up the FuturePass for 5Fh9D9cPZqkFjv5S4Zg4yD7K2Grzsy1YtFbcDzxBhfck9BkE",
        action: 'GET_FUTUREPASS',
        content: {
          address: '5Fh9D9cPZqkFjv5S4Zg4yD7K2Grzsy1YtFbcDzxBhfck9BkE',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Look up my FuturePass on TRN',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "Sure, I'll check your FuturePass on TRN",
        action: 'GET_FUTUREPASS',
        content: {
          address: '{{walletAddress}}',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Show me the futurepass linked to this address: 5Gw3s7q4QLkSWwknsiX2VSSZ3SRR2xKtZZ5tLNK6Y1Uo6BRG',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll retrieve the FuturePass for 5Gw3s7q4QLkSWwknsiX2VSSZ3SRR2xKtZZ5tLNK6Y1Uo6BRG",
        action: 'GET_FUTUREPASS',
        content: {
          address: '5Gw3s7q4QLkSWwknsiX2VSSZ3SRR2xKtZZ5tLNK6Y1Uo6BRG',
        },
      },
    },
  ],
];
