import { Wallet, isHexString } from "ethers";

/** Normalize hex private key (with or without 0x). WIF is not supported on BSC — hex only. */
export function walletFromPrivateKey(input: string): Wallet {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Private key is required");
  }

  if (trimmed.toLowerCase().startsWith("0x")) {
    if (!isHexString(trimmed, 32)) {
      throw new Error("Invalid hex private key (expected 32 bytes)");
    }
    return new Wallet(trimmed);
  }

  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return new Wallet(`0x${trimmed}`);
  }

  throw new Error(
    "Use a 64-character hex private key (optionally prefixed with 0x). WIF is for Bitcoin, not BEP20."
  );
}
