import { elizaLogger } from '@elizaos/core';
import { ApiPromise } from '@polkadot/api';

type AssetDetail = {
  id: number;
  symbol: string;
  decimals: number;
};

const assetListString = JSON.stringify({
  mainnet: [
    { id: 1, symbol: 'ROOT', decimals: 6 },
    { id: 2, symbol: 'XRP', decimals: 6 },
    { id: 121956, symbol: 'ZRP', decimals: 8 },
    { id: 4196, symbol: 'ASTO', decimals: 18 },
    { id: 2148, symbol: 'SYLO', decimals: 18 },
    { id: 6244, symbol: 'USDT', decimals: 6 },
    { id: 98404, symbol: '$30MM', decimals: 6 },
    { id: 142436, symbol: 'DCC', decimals: 6 },
    { id: 128100, symbol: 'STONE', decimals: 6 },
    { id: 129124, symbol: 'ALLOY', decimals: 6 },
    { id: 130148, symbol: 'GOLD', decimals: 6 },
    { id: 131172, symbol: 'OOZE', decimals: 6 },
    { id: 132196, symbol: 'GEMS', decimals: 6 },
    { id: 3, symbol: 'VTX', decimals: 6 },
    { id: 3172, symbol: 'USDC', decimals: 6 },
    { id: 1124, symbol: 'ETH', decimals: 18 },
    { id: 201828, symbol: 'ZMC', decimals: 0 },
  ],
  testnet: [
    { id: 1, symbol: 'ROOT', decimals: 6 },
    { id: 2, symbol: 'XRP', decimals: 6 },
    { id: 205924, symbol: 'ZRP', decimals: 8 },
    { id: 17508, symbol: 'ASTO', decimals: 18 },
    { id: 3172, symbol: 'SYLO', decimals: 18 },
    { id: 2148, symbol: 'SepoliaUSDC', decimals: 6 },
    { id: 218212, symbol: 'GOLD', decimals: 6 },
  ],
});

type OnchainAsset = {
  id: number;
  deposit: string;
  name: string;
  symbol: string;
  decimals: number;
  isFrozen: boolean;
};

export async function getOnchainSymbol(api: ApiPromise, assetSymbol: string): Promise<OnchainAsset | null> {
  const assets = await api.query.assets.metadata.entries();
  const parsedAssets: OnchainAsset[] = assets.map(([key, value]) => {
    const id = key.args[0].toHuman() as number;
    const metadata = value.toHuman() as {
      deposit: string;
      name: string;
      symbol: string;
      decimals: string;
      isFrozen: boolean;
    };

    return {
      id,
      deposit: metadata.deposit,
      name: metadata.name,
      symbol: metadata.symbol,
      decimals: parseInt(metadata.decimals, 10),
      isFrozen: metadata.isFrozen,
    };
  });

  const sanitizedSymbol = assetSymbol.trim().toLowerCase();
  const match = parsedAssets.find(
    (a) => a.symbol.trim().toLowerCase() === sanitizedSymbol || a.name.trim().toLowerCase() === sanitizedSymbol
  );

  if (!match) {
    return null;
  }

  return match;
}

export async function getOnchainAssetId(api: ApiPromise, assetId: number): Promise<OnchainAsset | null> {
  const asset = (await api.query.assets.metadata(assetId)) as unknown as OnchainAsset | null;
  return asset;
}
