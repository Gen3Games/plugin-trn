export const getTrnBalanceTemplate = `
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

export const trnTransferTemplate = `
{{recentMessages}}

{{walletInfo}}

Extract the following details:
- Token symbol or asset id. Optional.
- Amount to transfer (as a string, e.g., "0.1").
- Recipient address (TRN address).

Return a JSON object like:

\`\`\`json
{
  "token": string | number | null,
  "amount": string | null,
  "recipient": string | null,
}
\`\`\`
`;

export const getTrnFuturePassTemplate = `
{{recentMessages}}

{{walletInfo}}

Extract the following detail:
- Wallet address to check. Optional. If not given, use the default TRN wallet.

Return a JSON object like:

\`\`\`json
{
  "address": string | null
}
\`\`\`
`;
