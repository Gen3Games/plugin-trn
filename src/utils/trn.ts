import { ApiPromise } from '@polkadot/api';
import { getApiOptions, getPublicProvider } from '@therootnetwork/api';
import { formatUnits } from 'ethers';
import { AssetBuilder, BatchBuilder, CustomExtrinsicBuilder } from '@futureverse/transact';
import { AccountAssetDetails, FrameSystemAccountInfo } from '../types';
import { ethers } from 'ethers';

export async function getApi(networkSet?: 'mainnet' | 'testnet'): Promise<ApiPromise> {
  if (!networkSet) networkSet = process.env.NEXT_PUBLIC_NETWORK_SET as 'mainnet' | 'testnet';
  const trnApi =
    networkSet === 'mainnet'
      ? await ApiPromise.create({
          ...getApiOptions(),
          ...getPublicProvider('root'),
        })
      : await ApiPromise.create({
          ...getApiOptions(),
          ...getPublicProvider('porcini'),
        });
  trnApi.on('connected', () => {
    console.log(`Substrate Client connected.`);
  });
  return trnApi;
}

export enum Network {
  Root = 7668,
  Porcini = 7672,
}

export const formatTrnNumber = (val: number): string => val.toString().replace(/,/g, '');
export const formatTrnNumberString = (val: string): string => val.toString().replace(/,/g, '');

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const convertBigIntToDecimal = (num: bigint, decimals: number): number => {
  return parseFloat(formatUnits(num.toString(), decimals));
};

export const convertDecimalToBigInt = (num: number | string, decimals: number): bigint => {
  let numStr = typeof num === 'string' ? num : num.toFixed(decimals);
  if (typeof num === 'string') {
    const decimalIndex = numStr.indexOf('.');
    if (decimalIndex !== -1 && numStr.length - decimalIndex - 1 > decimals) {
      numStr = parseFloat(numStr).toFixed(decimals);
    }
  }

  return ethers.parseUnits(numStr, decimals);
};

type FeeValidationResult = { success: boolean; error?: string };

export async function validateAndAddFeeProxy(
  batcher: BatchBuilder | AssetBuilder | CustomExtrinsicBuilder,
  trnApi: ApiPromise,
  address: string
): Promise<FeeValidationResult> {
  if (!trnApi || !batcher) {
    return { success: false, error: 'TRN API or batcher is not initialized' };
  }

  try {
    // Step 1: Fetch XRP balance of the address
    const result = (
      await trnApi.query.assets.account(2, address)
    ).toPrimitive() as unknown as AccountAssetDetails | null;
    if (!result) {
      throw new Error(`No balance found for ${address} on TRN`);
    }
    const xrpBalance = BigInt(result.balance);

    // Step 2: Fetch gas fees for the current batch
    const initialGasFees = await batcher.getGasFees();

    // Step 3: Check if user has enough balance to pay for fees
    if (xrpBalance >= BigInt(initialGasFees.gasFee)) {
      return { success: true }; // User has enough funds, proceed
    }

    // Step 4: Add a fee proxy with asset ID 1 (ROOT) and retry
    await batcher.addFeeProxy({
      assetId: 1,
      slippage: 5,
    });

    // Step 5: Fetch gas fees again after fee proxy is added
    const updatedGasFees = await batcher.getGasFees();

    // Step 6: Check ROOT balance with updated gas fees
    const accountInfo = (await trnApi.query.system.account(address)) as unknown as FrameSystemAccountInfo | null;
    if (!accountInfo) {
      return { success: false, error: 'Invalid account' };
    }
    const freeBalance = BigInt(accountInfo?.data?.free || 0n);

    if (freeBalance < BigInt(updatedGasFees.gasFee)) {
      return { success: false, error: 'Insufficient funds to cover gas fees, in both XRP & ROOT' };
    }

    return { success: true }; // Fee proxy successfully applied
  } catch (error) {
    console.error('Error validating gas fees:', error);
    return { success: false, error: 'Failed to validate gas fees' };
  }
}

export function returnBlockExplorer(network: 'mainnet' | 'testnet', extrensicId: string): string {
  if (network === 'testnet') {
    return `https://porcini.rootscan.io/extrinsics/${extrensicId}`;
  } else {
    return `https://rootscan.io/extrinsics/${extrensicId}`;
  }
}
