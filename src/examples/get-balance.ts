import { ActionExample } from '@elizaos/core';

export const getTrnBalanceExamples: ActionExample[][] = [
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Check my balance of ROOT',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll help you check your balance of ROOT",
        action: 'GET_BALANCE',
        content: {
          address: '{{walletAddress}}',
          token: 'ROOT',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Check my balance of asset id 208120',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll help you check your balance of asset id 208120",
        action: 'GET_BALANCE',
        content: {
          address: '{{walletAddress}}',
          token: '208120',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Get ROOT balance of 0x1234',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll help you check ROOT balance of 0x1234",
        action: 'GET_BALANCE',
        content: {
          address: '0x1234',
          token: 'ROOT',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Check balance of 0x1234 with asset id 208120',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll help you check ROOT balance of 0x1234",
        action: 'GET_BALANCE',
        content: {
          address: '0x1234',
          token: '208120',
        },
      },
    },
  ],
];
