/* get-balance types */

import { Content } from '@elizaos/core';

export interface AccountAssetDetails {
  balance: number;
  isFrozen: boolean;
}

export interface FrameSystemAccountInfo {
  nonce: number;
  consumers: number;
  providers: number;
  sufficients: number;
  data: PalletBalancesAccountData;
}

interface PalletBalancesAccountData {
  free: bigint;
  reserved: bigint;
  miscFrozen: bigint;
  feeFrozen: bigint;
}

/* ElizaOS content type */

export interface BalanceContent extends Content {
  address: string;
  token: string | number;
}
