# `@elizaos/plugin-trn`

This plugin enables interaction with **The Root Network (TRN)**, allowing ElizaOS agents to query balances, fetch FuturePass identities, and send tokens through wallet-integrated handlers.

---

## Configuration

### Basic Setup

To enable this plugin, add your TRN credentials to a `.env` file:

```env
TRN_PUBLIC_KEY=your-wallet-address-here
TRN_PRIVATE_KEY=your-private-key-here  # optional, required for send operations
```

> `TRN_PUBLIC_KEY` is used for read operations (e.g., checking your own balance).
> `TRN_PRIVATE_KEY` is needed for writing actions (e.g., transfers).

### Network Selection

Choose between `mainnet` or `testnet` via:

```env
PUBLIC_NETWORK_SET=testnet
```

Defaults to `mainnet` if not specified.

---

## Actions

### `GET_BALANCE`

Returns the balance of a given token at a specific TRN address.

**Required**:
- `token`: symbol (`ROOT`, `XRP`, etc.) or ID

**Optional**:
- `address`: if omitted, uses `TRN_PUBLIC_KEY`

**Example usage**:

```bash
What is my USDC balance?
How much XRP does 0x332895 have?
```

---

### `GET_FUTUREPASS`

Looks up the **FuturePass** smart wallet identity for a TRN account.

**Required**:
- `address`: TRN wallet address to query

**If omitted**, the agent uses `TRN_PUBLIC_KEY`.

**Example usage**:

```bash
What is my FuturePass address?
Look up FuturePass for 0xabc123
```

---

### `SEND_TOKEN`

Transfers a token on TRN from the agent's wallet to a recipient.

**Required**:
- `token`: symbol or ID
- `amount`: string-formatted decimal
- `recipient`: TRN address

**Returns**:
- Confirmation message
- Link to transaction on block explorer

**Example usage**:

```bash
Send 5 ROOT to 0xabc123
Transfer 120 ZRP to 0xfeedbeef
```

---

## Error Handling

This plugin includes:
- Flexible prompts and inference using ElizaOS `generateObjectDeprecated`
- Runtime validation of tokens, addresses, and on-chain assets
- Helpful user-facing error messages

---

## Internals

- Powered by TRN RPC and pallet-native calls
- Wraps ElizaOS templates, planners, and state composition

---

## Contributing

This plugin uses:
- Examples (`examples/`)
- Templates (`templates/`)
- Typed handlers (`actions/`)

---

Built by [@guigs](https://github.com/GuigsEvt) for Gen3 Games and TRN Labs.
