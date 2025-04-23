import { ActionExample } from '@elizaos/core';

export const getTrnBalanceExamples: ActionExample[][] = [
  [
    {
      user: '{{user1}}',
      content: {
        text: "What's your ROOT holdings?",
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: 'Let me check my ROOT balance.',
        action: 'GET_BALANCE',
        content: {
          token: 'ROOT',
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
        text: "What's your balance of ROOT?",
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: "I'll check my ROOT balance.",
        action: 'GET_BALANCE',
        content: {
          token: 'ROOT',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'How much XRP do you have?',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: 'Let me check my XRP balance.',
        action: 'GET_BALANCE',
        content: {
          token: 'XRP',
        },
      },
    },
  ],
];
