"use client";

import { useState } from "react";
import * as bitcoin from "bitcoinjs-lib";
import { Transaction } from "ethers";

export function DecodeBitcoinForm() {
  const [hex, setHex] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const decode = () => {
    setError("");
    setResult("");
    try {
      const tx = bitcoin.Transaction.fromHex(hex.trim());
      const outs = tx.outs.map((o, i) => ({
        index: i,
        valueBtc: (Number(o.value) / 1e8).toFixed(8),
        script: Buffer.from(o.script).toString("hex"),
      }));
      setResult(
        JSON.stringify(
          {
            txid: tx.getId(),
            version: tx.version,
            locktime: tx.locktime,
            inputs: tx.ins.length,
            outputs: outs,
          },
          null,
          2
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid transaction hex");
    }
  };

  return (
    <DecodeShell
      title="Decode Bitcoin transaction"
      hex={hex}
      onHexChange={setHex}
      onDecode={decode}
      result={result}
      error={error}
    />
  );
}

export function DecodeEthereumForm() {
  const [hex, setHex] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const decode = () => {
    setError("");
    setResult("");
    try {
      const raw = hex.trim().startsWith("0x") ? hex.trim() : `0x${hex.trim()}`;
      const tx = Transaction.from(raw);
      setResult(
        JSON.stringify(
          {
            hash: tx.hash ?? null,
            to: tx.to,
            from: tx.from,
            nonce: tx.nonce.toString(),
            value: tx.value.toString(),
            gasLimit: tx.gasLimit.toString(),
            gasPrice: tx.gasPrice?.toString(),
            chainId: tx.chainId?.toString(),
            data: tx.data,
          },
          null,
          2
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid transaction hex");
    }
  };

  return (
    <DecodeShell
      title="Decode Ethereum transaction"
      hex={hex}
      onHexChange={setHex}
      onDecode={decode}
      result={result}
      error={error}
    />
  );
}

function DecodeShell({
  title,
  hex,
  onHexChange,
  onDecode,
  result,
  error,
}: {
  title: string;
  hex: string;
  onHexChange: (v: string) => void;
  onDecode: () => void;
  result: string;
  error: string;
}) {
  return (
    <div className="w-full max-w-2xl space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <textarea
        value={hex}
        onChange={(e) => onHexChange(e.target.value)}
        placeholder="Paste signed transaction hex…"
        rows={6}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-xs text-zinc-100 outline-none focus:border-sky-500"
      />
      <button
        type="button"
        onClick={onDecode}
        className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-3 font-semibold text-white hover:from-sky-500 hover:to-blue-600"
      >
        Decode
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {result && (
        <pre className="overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-950 p-4 text-xs text-zinc-300">
          {result}
        </pre>
      )}
    </div>
  );
}
