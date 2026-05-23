export type ChainId =
  | "bitcoin"
  | "ethereum"
  | "tron"
  | "bnb"
  | "usdt-bep20"
  | "usdt-trc20"
  | "usdt-erc20"
  | "usdc-erc20";

export type ChainKind =
  | "bitcoin"
  | "evm-native"
  | "evm-erc20"
  | "tron-native"
  | "tron-trc20";

export interface ChainConfig {
  id: ChainId;
  path: string;
  title: string;
  subtitle: string;
  contractAddress?: string;
  contractLink?: string;
  kind: ChainKind;
  addressLabel: string;
  assetSymbol: string;
  gasSymbol: string;
  addressPlaceholder: string;
  charMax: number;
  keyHint: string;
  explorer: string;
  explorerName: string;
  networkName: string;
  rpcUrl: string;
  chainId?: number;
  tokenAddress?: string;
  tokenDecimals?: number;
  tronTokenAddress?: string;
}

export const CHAINS: Record<ChainId, ChainConfig> = {
  bitcoin: {
    id: "bitcoin",
    path: "/bitcoin",
    title: "Easy Bitcoin transaction online",
    subtitle: "Send BTC on the Bitcoin mainnet. Fees are paid in BTC.",
    kind: "bitcoin",
    addressLabel: "Your Bitcoin address",
    assetSymbol: "BTC",
    gasSymbol: "BTC",
    addressPlaceholder: "bc1… or 1… or 3…",
    charMax: 90,
    keyHint: "WIF or hex private key",
    explorer: "https://mempool.space",
    explorerName: "mempool.space",
    networkName: "Bitcoin",
    rpcUrl: "",
  },
  ethereum: {
    id: "ethereum",
    path: "/ethereum",
    title: "Easy Ethereum transaction online",
    subtitle: "Send native ETH on Ethereum mainnet.",
    kind: "evm-native",
    addressLabel: "Your Ethereum address",
    assetSymbol: "ETH",
    gasSymbol: "ETH",
    addressPlaceholder: "0x…",
    charMax: 42,
    keyHint: "Hex private key (0x optional)",
    explorer: "https://etherscan.io",
    explorerName: "etherscan.io",
    networkName: "Ethereum",
    rpcUrl:
      process.env.NEXT_PUBLIC_ETH_RPC_URL ?? "https://ethereum.publicnode.com",
    chainId: 1,
  },
  tron: {
    id: "tron",
    path: "/tron",
    title: "Easy Tron transaction online",
    subtitle: "Send native TRX on the Tron mainnet.",
    kind: "tron-native",
    addressLabel: "Your Tron address",
    assetSymbol: "TRX",
    gasSymbol: "TRX",
    addressPlaceholder: "T…",
    charMax: 34,
    keyHint: "Hex private key (64 chars)",
    explorer: "https://tronscan.org",
    explorerName: "tronscan.org",
    networkName: "Tron",
    rpcUrl:
      process.env.NEXT_PUBLIC_TRON_RPC_URL ?? "https://api.trongrid.io",
  },
  bnb: {
    id: "bnb",
    path: "/bnb",
    title: "Easy BNB transaction online",
    subtitle: "Send native BNB on Binance Smart Chain (BEP20 network).",
    kind: "evm-native",
    addressLabel: "Your BNB address",
    assetSymbol: "BNB",
    gasSymbol: "BNB",
    addressPlaceholder: "0x…",
    charMax: 42,
    keyHint: "Hex private key (0x optional)",
    explorer: "https://bscscan.com",
    explorerName: "bscscan.com",
    networkName: "BSC",
    rpcUrl:
      process.env.NEXT_PUBLIC_BSC_RPC_URL ?? "https://bsc-dataseed.binance.org/",
    chainId: 56,
  },
  "usdt-bep20": {
    id: "usdt-bep20",
    path: "/",
    title: "Easy USDT BEP20 transaction online USD Tether",
    subtitle: "Send USDT — official Tether on Binance Smart Chain.",
    contractAddress: "0x55d398326f99059fF775485246999027B3197955",
    contractLink:
      "https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955",
    kind: "evm-erc20",
    addressLabel: "Your USDT BEP20 address",
    assetSymbol: "USDT",
    gasSymbol: "BNB",
    addressPlaceholder: "0x…",
    charMax: 42,
    keyHint: "Hex private key (0x optional)",
    explorer: "https://bscscan.com",
    explorerName: "bscscan.com",
    networkName: "BSC",
    rpcUrl:
      process.env.NEXT_PUBLIC_BSC_RPC_URL ?? "https://bsc-dataseed.binance.org/",
    chainId: 56,
    tokenAddress: "0x55d398326f99059fF775485246999027B3197955",
    tokenDecimals: 18,
  },
  "usdt-trc20": {
    id: "usdt-trc20",
    path: "/usdt-trc20",
    title: "Easy USDT TRC20 transaction online",
    subtitle: "Send USDT on Tron (TRC20).",
    contractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    contractLink:
      "https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    kind: "tron-trc20",
    addressLabel: "Your USDT TRC20 address",
    assetSymbol: "USDT",
    gasSymbol: "TRX",
    addressPlaceholder: "T…",
    charMax: 34,
    keyHint: "Hex private key (64 chars)",
    explorer: "https://tronscan.org",
    explorerName: "tronscan.org",
    networkName: "Tron",
    rpcUrl:
      process.env.NEXT_PUBLIC_TRON_RPC_URL ?? "https://api.trongrid.io",
    tronTokenAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    tokenDecimals: 6,
  },
  "usdt-erc20": {
    id: "usdt-erc20",
    path: "/usdt-erc20",
    title: "Easy USDT ERC20 transaction online",
    subtitle: "Send USDT on Ethereum (ERC20).",
    contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    contractLink:
      "https://etherscan.io/token/0xdAC17F958D2ee523a2206206994597C13D831ec7",
    kind: "evm-erc20",
    addressLabel: "Your USDT ERC20 address",
    assetSymbol: "USDT",
    gasSymbol: "ETH",
    addressPlaceholder: "0x…",
    charMax: 42,
    keyHint: "Hex private key (0x optional)",
    explorer: "https://etherscan.io",
    explorerName: "etherscan.io",
    networkName: "Ethereum",
    rpcUrl:
      process.env.NEXT_PUBLIC_ETH_RPC_URL ?? "https://ethereum.publicnode.com",
    chainId: 1,
    tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    tokenDecimals: 6,
  },
  "usdc-erc20": {
    id: "usdc-erc20",
    path: "/usdc-erc20",
    title: "Easy USDC ERC20 transaction online",
    subtitle: "Send USDC on Ethereum (ERC20).",
    contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    contractLink:
      "https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    kind: "evm-erc20",
    addressLabel: "Your USDC ERC20 address",
    assetSymbol: "USDC",
    gasSymbol: "ETH",
    addressPlaceholder: "0x…",
    charMax: 42,
    keyHint: "Hex private key (0x optional)",
    explorer: "https://etherscan.io",
    explorerName: "etherscan.io",
    networkName: "Ethereum",
    rpcUrl:
      process.env.NEXT_PUBLIC_ETH_RPC_URL ?? "https://ethereum.publicnode.com",
    chainId: 1,
    tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    tokenDecimals: 6,
  },
};

export const NETWORK_TABS = [
  { label: "Bitcoin", chainId: "bitcoin" as const },
  { label: "Ethereum", chainId: "ethereum" as const },
  { label: "Tron", chainId: "tron" as const },
  { label: "BNB", chainId: "bnb" as const },
  { label: "USDT BEP20", chainId: "usdt-bep20" as const },
  { label: "USDT TRC20", chainId: "usdt-trc20" as const },
  { label: "USDT ERC20", chainId: "usdt-erc20" as const },
  { label: "USDC ERC20", chainId: "usdc-erc20" as const },
];

export function getChainByPath(path: string): ChainConfig | undefined {
  return Object.values(CHAINS).find((c) => c.path === path);
}
