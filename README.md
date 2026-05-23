# Easy Send

Multi-chain crypto send UI (Next.js), inspired by [SecretScan](https://secretscan.org/Easy_usdt_bep20_transaction_online).

## Supported networks

| Tab | Route | Asset |
|-----|-------|-------|
| Bitcoin | `/bitcoin` | BTC |
| Ethereum | `/ethereum` | ETH |
| Tron | `/tron` | TRX |
| BNB | `/bnb` | BNB (BSC) |
| USDT BEP20 | `/` | USDT on BSC |
| USDT TRC20 | `/usdt-trc20` | USDT on Tron |
| USDT ERC20 | `/usdt-erc20` | USDT on Ethereum |
| USDC ERC20 | `/usdc-erc20` | USDC on Ethereum |

**Tools:** `/decode-bitcoin`, `/decode-ethereum`

## Setup

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

## Security

Private keys are used only in the browser. Never use mainnet keys on untrusted machines. Prefer hardware wallets or browser extensions for production.

## Stack

Next.js · Tailwind · ethers.js · bitcoinjs-lib · tronweb
