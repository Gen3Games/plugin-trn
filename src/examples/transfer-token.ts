import { ActionExample } from '@elizaos/core';

export const sendTokenExamples: ActionExample[][] = [
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Send 100 ROOT to 0x1234',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: 'Sending 100 ROOT to address 0x1234.',
        action: 'send_token',
        content: {
          recipient: '0x1234',
          token: 'ROOT',
          amount: '100',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Transfer 50 XRP to 0x5678',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: 'Transferring 50 XRP to 0x5678.',
        action: 'send_token',
        content: {
          recipient: '0x5678',
          token: 'XRP',
          amount: '50',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Send 200 of token 208120 to 0xABCD',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: 'Sending 200 of token 208120 to 0xABCD.',
        action: 'send_token',
        content: {
          recipient: '0xABCD',
          token: '208120',
          amount: '200',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Please send 5 USDC to 0x9999',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: 'Sending 5 USDC to address 0x9999.',
        action: 'send_token',
        content: {
          recipient: '0x9999',
          token: 'USDC',
          amount: '5',
        },
      },
    },
  ],
  [
    {
      user: '{{user1}}',
      content: {
        text: 'Can you transfer 1.5 ETH to 0xFEED',
      },
    },
    {
      user: '{{agent}}',
      content: {
        text: 'Transferring 1.5 ETH to 0xFEED.',
        action: 'send_token',
        content: {
          recipient: '0xFEED',
          token: 'ETH',
          amount: '1.5',
        },
      },
    },
  ],
];
