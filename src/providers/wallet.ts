import type { IAgentRuntime, Provider, Memory, State } from '@elizaos/core';
import { elizaLogger } from '@elizaos/core';

import type { Address } from 'viem';
import { getApi, validateAndAddFeeProxy } from '../utils/trn';
import { ApiPromise } from '@polkadot/api';
import { AccountAssetDetails, FrameSystemAccountInfo } from '../types';
import { Signer, ViemSigner } from '@futureverse/signer';
import { TransactionBuilder } from '@futureverse/transact';
import { privateKeyToAccount } from 'viem/accounts';

export class TrnWalletProvider {
  constructor(
    private runtime: IAgentRuntime,
    private address: Address,
    private signer: Signer | null,
    private network: 'testnet' | 'mainnet'
  ) {}

  getAddress(): Address {
    return this.address;
  }

  async getBalance(assetId: number): Promise<bigint> {
    const trnApi = (await getApi(this.network)) as ApiPromise;
    let rawBalance: bigint;
    if (assetId === 1) {
      // rawBalance = BigInt((await trnApi.rpc.assetsExt.freeBalance(assetId, targetAddress)).toJSON());
      const accountInfo = (await trnApi.query.system.account(this.address)) as unknown as FrameSystemAccountInfo | null;
      if (!accountInfo) {
        throw new Error(`No account info found for ${this.address}`);
      }

      const bigIntFree = accountInfo?.data?.free || 0n;
      const bigIntMiscFrozen = accountInfo?.data?.miscFrozen || 0n;

      const bigIntBalance = BigInt(bigIntFree - bigIntMiscFrozen);
      rawBalance = bigIntBalance;
    } else {
      const result = (
        await trnApi.query.assets.account(assetId, this.address)
      ).toPrimitive() as unknown as AccountAssetDetails | null;
      if (!result) {
        throw new Error(`No balance found for ${this.address} on TRN`);
      }
      rawBalance = BigInt(result.balance);
    }
    return rawBalance;
  }

  async transfer(assetId: number, to: Address, amount: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer is not initialized');
    }
    const trnApi = (await getApi(this.network)) as ApiPromise;
    const signer = this.signer;

    const transaction = TransactionBuilder.asset(trnApi, this.signer, this.address, assetId);
    transaction.transfer({
      destinationAddress: to,
      amount: amount,
    });
    const validation = await validateAndAddFeeProxy(transaction, trnApi, this.address);
    if (!validation.success) {
      elizaLogger.error(validation.error);
      throw new Error('Insufficient funds to cover gas fees, in both XRP & ROOT');
    }
    const result = await transaction.signAndSend();
    return result.toString();
  }

  //   async swap(inputSymbol: string, outputSymbol: string, amount: string): Promise<string> {
  //     // Placeholder logic for swapping via future DEX pallet
  //     const network = process.env.NEXT_PUBLIC_NETWORK_SET === 'mainnet' ? 'mainnet' : 'testnet';
  //     const input = getAssetBySymbol(inputSymbol, network);
  //     const output = getAssetBySymbol(outputSymbol, network);

  //     if (!input || !output) {
  //       throw new Error('Invalid token symbols for swap');
  //     }

  //     const trnApi = (await getApi(this.network)) as ApiPromise;
  //     const signer = this.runtime.get('trnSigner');
  //     const tx = trnApi.tx.dex.swap(
  //       input.id,
  //       output.id,
  //       BigInt(Number(amount) * 10 ** input.decimals),
  //       0 // slippage param can be passed here
  //     );
  //     const result = await tx.signAndSend(signer);
  //     return result.toString();
  //   }
}

export const initWalletProvider = async (runtime: IAgentRuntime): Promise<TrnWalletProvider> => {
  const privateKey = runtime.getSetting('TRN_PRIVATE_KEY');
  if (!privateKey) {
    throw new Error('TRN wallet private key not found');
  }
  const address = runtime.getSetting('TRN_PUBLIC_KEY') as `0x${string}` | undefined;
  if (!address) {
    throw new Error('TRN wallet address not found');
  }
  const network = (runtime.getSetting('PUBLIC_NETWORK_SET') as 'mainnet' | 'testnet') ?? 'testnet';

  const account = privateKeyToAccount(`0x${privateKey}`);
  const signer = new ViemSigner(account);

  if ((await signer.getAddress()) !== address) {
    throw new Error('ADDRESS and PRIVATE_KEY do not match');
  }

  return new TrnWalletProvider(runtime, address, signer, network);
};

export const trnWalletProvider: Provider = {
  async get(runtime: IAgentRuntime, _message: Memory, _state?: State): Promise<string | null> {
    try {
      const address = runtime.getSetting('TRN_PUBLIC_KEY') as `0x${string}` | undefined;
      if (!address) {
        throw new Error('TRN wallet address not found');
      }
      const network = (runtime.getSetting('PUBLIC_NETWORK_SET') as 'mainnet' | 'testnet') ?? 'testnet';
      const wallet = new TrnWalletProvider(runtime, address, null, network);
      const rootBalance = await wallet.getBalance(1);
      return `TRN Wallet Address: ${wallet.getAddress()}\nBalance: ${rootBalance} ROOT`;
    } catch (e) {
      elizaLogger.error('TRN wallet provider error:', e);
      return null;
    }
  },
};
