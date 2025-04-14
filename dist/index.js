// src/actions/get-balance.ts
import {
  composeContext,
  elizaLogger,
  generateObjectDeprecated,
  ModelClass
} from "@elizaos/core";

// src/utils/assets.ts
var assetLists = {
  mainnet: [
    { id: 1, symbol: "ROOT", decimals: 6 },
    { id: 2, symbol: "XRP", decimals: 6 },
    { id: 121956, symbol: "ZRP", decimals: 8 },
    { id: 4196, symbol: "ASTO", decimals: 18 },
    { id: 2148, symbol: "SYLO", decimals: 18 },
    { id: 6244, symbol: "USDT", decimals: 6 },
    { id: 98404, symbol: "$30MM", decimals: 6 },
    { id: 142436, symbol: "DCC", decimals: 6 },
    { id: 128100, symbol: "STONE", decimals: 6 },
    { id: 129124, symbol: "ALLOY", decimals: 6 },
    { id: 130148, symbol: "GOLD", decimals: 6 },
    { id: 131172, symbol: "OOZE", decimals: 6 },
    { id: 132196, symbol: "GEMS", decimals: 6 },
    { id: 3, symbol: "VTX", decimals: 6 },
    { id: 3172, symbol: "USDC", decimals: 6 },
    { id: 1124, symbol: "ETH", decimals: 18 },
    { id: 201828, symbol: "ZMC", decimals: 0 }
  ],
  testnet: [
    { id: 1, symbol: "ROOT", decimals: 6 },
    { id: 2, symbol: "XRP", decimals: 6 },
    { id: 205924, symbol: "ZRP", decimals: 8 },
    { id: 17508, symbol: "ASTO", decimals: 18 },
    { id: 3172, symbol: "SYLO", decimals: 18 },
    { id: 2148, symbol: "SepoliaUSDC", decimals: 6 },
    { id: 218212, symbol: "GOLD", decimals: 6 }
  ]
};
function getAssetBySymbol(symbol, network) {
  const list = assetLists[network];
  return list.find((asset) => asset.symbol.toLowerCase() === symbol.toLowerCase())?.id ?? null;
}

// src/examples/get-balance.ts
var getTrnBalanceExamples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "Check my balance of ROOT"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll help you check your balance of ROOT",
        action: "GET_BALANCE",
        content: {
          address: "{{walletAddress}}",
          token: "ROOT"
        }
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Check my balance of asset id 208120"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll help you check your balance of asset id 208120",
        action: "GET_BALANCE",
        content: {
          address: "{{walletAddress}}",
          token: "208120"
        }
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Get ROOT balance of 0x1234"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll help you check ROOT balance of 0x1234",
        action: "GET_BALANCE",
        content: {
          address: "0x1234",
          token: "ROOT"
        }
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Check balance of 0x1234 with asset id 208120"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll help you check ROOT balance of 0x1234",
        action: "GET_BALANCE",
        content: {
          address: "0x1234",
          token: "208120"
        }
      }
    }
  ]
];

// src/templates/index.ts
var getTrnBalanceTemplate = `
{{recentMessages}}

{{walletInfo}}

Extract the following details:
- Wallet address to check. Optional. If not given, use the default TRN wallet.
- Token symbol or asset id. Default is "ROOT".

Return a JSON object like:

\`\`\`json
{
  "address": string | null,
  "token": string | number | null 
}
\`\`\`
`;

// src/utils/trn.ts
import { ApiPromise } from "@polkadot/api";
import { getApiOptions, getPublicProvider } from "@therootnetwork/api";
import { formatUnits } from "ethers";
async function getApi(networkSet) {
  if (!networkSet) networkSet = process.env.NEXT_PUBLIC_NETWORK_SET;
  const trnApi = networkSet === "mainnet" ? await ApiPromise.create({
    ...getApiOptions(),
    ...getPublicProvider("root")
  }) : await ApiPromise.create({
    ...getApiOptions(),
    ...getPublicProvider("porcini")
  });
  trnApi.on("connected", () => {
    console.log(`Substrate Client connected.`);
  });
  return trnApi;
}

// src/actions/get-balance.ts
function isBalanceContent(runtime, content) {
  elizaLogger.log("Content for balance", content);
  return typeof content.address === "string" && (typeof content.token === "string" || typeof content.token === "number");
}
var getBalanceAction = {
  name: "getBalance",
  description: "Get balance of a TRN asset for the given address",
  handler: async (runtime, message, state, _options, callback) => {
    elizaLogger.log("Starting getBalance action...");
    let currentState = state;
    if (!currentState) {
      currentState = await runtime.composeState(message);
    } else {
      currentState = await runtime.updateRecentMessageState(currentState);
    }
    const network = process.env.PUBLIC_NETWORK_SET === "mainnet" ? "mainnet" : "testnet";
    const getBalanceContext = composeContext({
      state: currentState,
      template: getTrnBalanceTemplate
    });
    const content = await generateObjectDeprecated({
      runtime,
      context: getBalanceContext,
      modelClass: ModelClass.LARGE
    });
    if (!isBalanceContent(runtime, content)) {
      if (callback) {
        callback({
          text: "Address and token needed to get the balance.",
          content: { error: "Invalid balance content" }
        });
      }
      return false;
    }
    const token = content.token;
    const address = content.address;
    try {
      const assetId = typeof token === "string" ? await getAssetBySymbol(token, network) : token;
      if (!assetId) {
        const errorMsg = `Token '${token}' is not recognized on ${network}`;
        elizaLogger.error(errorMsg);
        callback?.({ text: errorMsg, content: { token, error: errorMsg } });
        return false;
      }
      const trnApi = await getApi(network);
      const api = trnApi;
      let rawBalance;
      if (assetId === 1) {
        const accountInfo = await api.query.system.account(address);
        if (!accountInfo) {
          throw new Error(`No account info found for ${address}`);
        }
        const bigIntFree = accountInfo?.data?.free || 0n;
        const bigIntMiscFrozen = accountInfo?.data?.miscFrozen || 0n;
        const bigIntBalance = BigInt(bigIntFree - bigIntMiscFrozen);
        rawBalance = bigIntBalance;
      } else {
        const result = (await trnApi.query.assets.account(assetId, address)).toPrimitive();
        if (!result) {
          throw new Error(`No balance found for ${token} on TRN`);
        }
        rawBalance = BigInt(result.balance);
      }
      callback?.({
        text: `${address} has ${rawBalance} ${token} on TRN.`,
        content: { address, token, balance: rawBalance.toString() }
      });
      return true;
    } catch (err) {
      const errorMessage = `Error getting balance for ${token} on TRN: ${err.message}`;
      elizaLogger.error(errorMessage);
      callback?.({
        text: errorMessage,
        content: {
          error: err.message,
          token
        }
      });
      return false;
    }
  },
  template: getTrnBalanceTemplate,
  validate: async (_runtime, message) => {
    elizaLogger.log("Validating get balance from user:", message.userId);
    return true;
  },
  examples: getTrnBalanceExamples,
  similes: ["GET_BALANCE", "CHECK_BALANCE"]
};

// src/index.ts
var trnPlugin = {
  name: "@elizaos-plugins/plugin-trn",
  description: "Plugin for interacting with the TRN Chain",
  config: [],
  actions: [getBalanceAction],
  providers: [],
  evaluators: [],
  services: [],
  clients: [],
  adapters: []
};
export {
  trnPlugin as default,
  trnPlugin
};
//# sourceMappingURL=index.js.map