import {
  Contract,
  JsonRpcProvider,
  formatUnits,
  isAddress,
  parseUnits,
} from "ethers";
import type { ChainConfig } from "./chains";
import { walletFromPrivateKey } from "./keys";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
] as const;

export function getEvmProvider(config: ChainConfig) {
  return new JsonRpcProvider(config.rpcUrl);
}

export async function fetchNativeBalance(
  config: ChainConfig,
  address: string
): Promise<string> {
  const provider = getEvmProvider(config);
  const raw = await provider.getBalance(address);
  return formatUnits(raw, 18);
}

export async function fetchErc20Balance(
  config: ChainConfig,
  address: string
): Promise<string> {
  if (!config.tokenAddress || config.tokenDecimals === undefined) {
    throw new Error("Token not configured");
  }
  const provider = getEvmProvider(config);
  const contract = new Contract(config.tokenAddress, ERC20_ABI, provider);
  const raw = await contract.balanceOf(address);
  return formatUnits(raw, config.tokenDecimals);
}

export async function fetchAssetBalance(
  config: ChainConfig,
  address: string
): Promise<string> {
  if (config.kind === "evm-erc20") return fetchErc20Balance(config, address);
  return fetchNativeBalance(config, address);
}

export function parseTokenAmount(config: ChainConfig, amount: string): bigint {
  const decimals = config.kind === "evm-erc20" ? config.tokenDecimals! : 18;
  return parseUnits(amount.trim() || "0", decimals);
}

export async function estimateEvmGasCost(
  config: ChainConfig,
  privateKey: string,
  from: string,
  to: string,
  amount: string
): Promise<string> {
  const wallet = walletFromPrivateKey(privateKey);
  const provider = getEvmProvider(config);
  const signer = wallet.connect(provider);
  let gasLimit: bigint;

  if (config.kind === "evm-erc20" && config.tokenAddress) {
    const contract = new Contract(config.tokenAddress, ERC20_ABI, signer);
    const value = parseTokenAmount(config, amount);
    if (value <= 0n) return "0";
    gasLimit = await contract.transfer.estimateGas(to, value);
  } else {
    const value = parseUnits(amount.trim() || "0", 18);
    if (value <= 0n) return "0";
    gasLimit = await signer.estimateGas({ to, value });
  }

  const fee = await provider.getFeeData();
  const gasPrice = fee.gasPrice ?? 3n * 10n ** 9n;
  return formatUnits(gasLimit * gasPrice, 18);
}

export async function signEvmTransaction(
  config: ChainConfig,
  privateKey: string,
  recipient: string,
  amount: string
): Promise<string> {
  if (!isAddress(recipient)) throw new Error("Invalid recipient address");
  const wallet = walletFromPrivateKey(privateKey);
  const provider = getEvmProvider(config);
  const signer = wallet.connect(provider);
  const chainId = BigInt(config.chainId ?? 1);

  if (config.kind === "evm-erc20" && config.tokenAddress) {
    const contract = new Contract(config.tokenAddress, ERC20_ABI, signer);
    const value = parseTokenAmount(config, amount);
    if (value <= 0n) throw new Error("Enter a valid amount");
    const tx = await contract.transfer.populateTransaction(recipient, value);
    return signer.signTransaction({ ...tx, chainId });
  }

  const value = parseUnits(amount.trim() || "0", 18);
  if (value <= 0n) throw new Error("Enter a valid amount");
  return signer.signTransaction({
    to: recipient,
    value,
    chainId,
  });
}

export async function broadcastEvmTransaction(
  config: ChainConfig,
  signedHex: string
): Promise<string> {
  const provider = getEvmProvider(config);
  const tx = await provider.broadcastTransaction(signedHex);
  return tx.hash;
}
