import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory } from "ecpair";
import * as ecc from "@bitcoinerlab/secp256k1";
import { decode as decodeWif } from "wif";

const ECPair = ECPairFactory(ecc);
const NETWORK = bitcoin.networks.bitcoin;

export interface BtcKeyPair {
  address: string;
  keyPair: ReturnType<typeof ECPair.fromPrivateKey>;
}

export function keyPairFromInput(input: string): BtcKeyPair {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Private key is required");

  let privateKey: Buffer;

  if (/^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(trimmed)) {
    const decoded = decodeWif(trimmed);
    privateKey = Buffer.from(decoded.privateKey);
  } else if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    privateKey = Buffer.from(trimmed, "hex");
  } else if (/^0x[0-9a-fA-F]{64}$/i.test(trimmed)) {
    privateKey = Buffer.from(trimmed.slice(2), "hex");
  } else {
    throw new Error("Use WIF or 64-character hex private key");
  }

  const keyPair = ECPair.fromPrivateKey(privateKey, { network: NETWORK });
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network: NETWORK,
  });
  if (!address) throw new Error("Could not derive address");
  return { address, keyPair };
}

interface Utxo {
  txid: string;
  vout: number;
  value: number;
}

export async function fetchBtcBalance(address: string): Promise<string> {
  const res = await fetch(
    `https://mempool.space/api/address/${encodeURIComponent(address)}`
  );
  if (!res.ok) throw new Error("Failed to fetch balance");
  const data = (await res.json()) as {
    chain_stats: { funded_txo_sum: number; spent_txo_sum: number };
  };
  const sats =
    data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
  return (sats / 1e8).toFixed(8);
}

async function fetchUtxos(address: string): Promise<Utxo[]> {
  const res = await fetch(
    `https://mempool.space/api/address/${encodeURIComponent(address)}/utxo`
  );
  if (!res.ok) throw new Error("Failed to fetch UTXOs");
  return res.json() as Promise<Utxo[]>;
}

export async function estimateBtcFee(address: string): Promise<string> {
  const utxos = await fetchUtxos(address);
  if (utxos.length === 0) return "0";
  const feeRateRes = await fetch(
    "https://mempool.space/api/v1/fees/recommended"
  );
  const fees = (await feeRateRes.json()) as { halfHourFee: number };
  const vBytes = 140;
  return ((fees.halfHourFee * vBytes) / 1e8).toFixed(8);
}

export async function buildAndSignBtcTx(
  privateKeyInput: string,
  recipient: string,
  amountBtc: string
): Promise<{ hex: string; feeBtc: string }> {
  const { address: fromAddress, keyPair } = keyPairFromInput(privateKeyInput);
  const amountSats = Math.round(parseFloat(amountBtc) * 1e8);
  if (!Number.isFinite(amountSats) || amountSats <= 0) {
    throw new Error("Enter a valid amount");
  }

  bitcoin.address.toOutputScript(recipient, NETWORK);

  const utxos = await fetchUtxos(fromAddress);
  if (utxos.length === 0) throw new Error("No UTXOs available");

  const feeRateRes = await fetch(
    "https://mempool.space/api/v1/fees/recommended"
  );
  const fees = (await feeRateRes.json()) as { halfHourFee: number };
  const feeRate = fees.halfHourFee;

  const psbt = new bitcoin.Psbt({ network: NETWORK });
  let inputSum = 0;

  for (const u of utxos) {
    psbt.addInput({
      hash: u.txid,
      index: u.vout,
      witnessUtxo: {
        script: bitcoin.payments.p2wpkh({
          pubkey: keyPair.publicKey,
          network: NETWORK,
        }).output!,
        value: BigInt(u.value),
      },
    });
    inputSum += u.value;
    if (inputSum >= amountSats + feeRate * 150) break;
  }

  const estimatedFee = feeRate * 150;
  const change = inputSum - amountSats - estimatedFee;
  if (change < 0) throw new Error("Insufficient balance for amount + fee");

  psbt.addOutput({ address: recipient, value: BigInt(amountSats) });
  if (change > 546) {
    psbt.addOutput({ address: fromAddress, value: BigInt(change) });
  }

  psbt.signAllInputs(keyPair);
  psbt.finalizeAllInputs();
  const hex = psbt.extractTransaction().toHex();
  return { hex, feeBtc: (estimatedFee / 1e8).toFixed(8) };
}

export async function broadcastBtcTx(hex: string): Promise<string> {
  const res = await fetch("https://mempool.space/api/tx", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: hex,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Broadcast failed");
  }
  return res.text();
}

export function isValidBtcAddress(addr: string): boolean {
  try {
    bitcoin.address.toOutputScript(addr, NETWORK);
    return true;
  } catch {
    return false;
  }
}
