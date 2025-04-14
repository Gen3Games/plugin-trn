# `@elizaos/plugin-trn`

This plugin enables interaction with **The Root Network (TRN)** ecosystem, allowing ElizaOS agents to query balances, transfer tokens, interact with the native pallets.

---

## Configuration

### Default Setup

By default, **plugin-trn** is not active. To use it, add your **TRN public address** (or wallet) to your `.env` file. Most operations such as balance lookups or inference will work without a private key, but write operations may be limited.

```env
TRN_PRIVATE_KEY=your-private-key-here
TRN_PUBLIC_KEY=your-public-address-here
```

### Network Selection

You can choose between **mainnet** and **testnet** via:

```env
NEXT_PUBLIC_NETWORK_SET=mainnet  # or testnet
```

If omit it will use **mainnet**.

---

## Actions

### Get Balance

Query the TRN balance of a token for a specific address.

**Required**:

- Token symbol (e.g. `ROOT`, `XRP`, `ZRP`)

**Optional**:

- Address (defaults to user wallet)

**Example usage:**

```bash
What is the ROOT balance of my wallet?
How much XRP does 0x332895 have?
```

### Transfer

Send a token to another wallet on TRN.

**Required**:

- Token
- Amount
- Recipient address

**Optional**:

- Memo/message

**Example usage:**

```bash
Send 100 ZRP to 0x19024120
Transfer 5 ROOT to 0x19024120
```

### Swap

The swap action allows ElizaOS to request a token swap on TRN using on-chain liquidity providers.

**Required**

- Input token
- Output token
- Amount
- Slippage (optional)

**Example usage:**

```bash
Swap 100 ZRP to XRP
Exchange 100 ZRP to XRP
```

---

## Error Handling

The plugin includes:

- Parameter validation via `validate()`
- Friendly error messages for missing tokens or addresses

---

## Contribution

The plugin contains typed handlers, prompt templates, and runtime support. Please add tests and examples when contributing new features.

---

Built by [@guigs](https://github.com/GuigsEvt) for Gen3 Games and TRN Labs.
