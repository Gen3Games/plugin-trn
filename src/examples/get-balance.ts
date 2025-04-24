import { ActionExample } from '@elizaos/core';

export const getTrnBalanceExamples: ActionExample[][] = [
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Check my balance of USDT',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll help you check your balance of USDT",
        action: 'GET_BALANCE',
        content: {
          address: '{{walletAddress}}',
          token: 'USDT',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Check my balance of token 0x1234',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll help you check your balance of token 0x1234",
        action: 'GET_BALANCE',
        content: {
          address: '{{walletAddress}}',
          token: '0x1234',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Get USDC balance of 0x1234',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll help you check USDC balance of 0x1234",
        action: 'GET_BALANCE',
        content: {
          address: '0x1234',
          token: 'USDC',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Check my wallet balance on TRN',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll help you check your wallet balance on TRN",
        action: 'GET_BALANCE',
        content: {
          address: '{{walletAddress}}',
          token: undefined,
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
        text: "I'll help you check token 208120 balance of 0x1234",
        action: 'GET_BALANCE',
        content: {
          address: '0x1234',
          token: '208120',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'What is the XRP balance for 0xFFfFFfff0000000000000000000000000003FCEB',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll help you check XRP balance of 0xFFfFFfff0000000000000000000000000003FCEB",
        action: 'GET_BALANCE',
        content: {
          address: '0xFFfFFfff0000000000000000000000000003FCEB',
          token: 'XRP',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Check my ROOT balance',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll check your ROOT balance.",
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
        text: 'How much XRP do I have?',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: 'Let me check your XRP balance.',
        action: 'GET_BALANCE',
        content: {
          address: '{{walletAddress}}',
          token: 'XRP',
        },
      },
    },
  ],
];
