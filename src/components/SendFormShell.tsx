"use client";

import type { ReactNode } from "react";

export type Status = {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
};

export function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold text-white">
      {n}
    </span>
  );
}

export function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <span className="text-xs text-zinc-500 tabular-nums">
      {value.length}
      {max > 0 ? ` / ${max}` : ""}
    </span>
  );
}

export function SendFormShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
      <div className="space-y-5">{children}</div>
    </div>
  );
}

export function SummaryGrid({
  balance,
  gas,
  total,
  assetSymbol,
  gasSymbol,
}: {
  balance: string;
  gas: string;
  total: string;
  assetSymbol: string;
  gasSymbol: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 text-center">
      <div>
        <p className="text-xs uppercase tracking-wide text-zinc-500">Balance</p>
        <p className="mt-1 text-lg font-semibold text-white">{balance}</p>
        <p className="text-xs text-zinc-500">{assetSymbol}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-zinc-500">Gas</p>
        <p className="mt-1 text-lg font-semibold text-white">{gas}</p>
        <p className="text-xs text-zinc-500">{gasSymbol} (est.)</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-zinc-500">Total</p>
        <p className="mt-1 text-lg font-semibold text-white">{total}</p>
        <p className="text-xs text-zinc-500">{assetSymbol}</p>
      </div>
    </div>
  );
}

export function StatusMessage({ status }: { status: Status }) {
  if (!status.message) return null;
  return (
    <p
      className={`text-sm ${
        status.type === "error"
          ? "text-red-400"
          : status.type === "success"
            ? "text-emerald-400"
            : "text-zinc-400"
      }`}
    >
      {status.message}
    </p>
  );
}

export function SignedHexBox({ hex }: { hex: string }) {
  if (!hex) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-3">
      <p className="mb-1 text-xs text-zinc-500">Signed transaction hex</p>
      <p className="break-all font-mono text-xs text-zinc-400">{hex}</p>
    </div>
  );
}

export function ActionButtons({
  onSend,
  onCopy,
  onClear,
  loading,
  showCopy = true,
}: {
  onSend: () => void;
  onCopy?: () => void;
  onClear: () => void;
  loading: boolean;
  showCopy?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onSend}
        disabled={loading}
        className="flex-1 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-sky-500 hover:to-blue-600 disabled:opacity-50"
      >
        Send transaction
      </button>
      {showCopy && onCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="rounded-xl border border-zinc-600 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          Copy hex
        </button>
      )}
      <button
        type="button"
        onClick={onClear}
        className="rounded-xl border border-zinc-600 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
      >
        Clear
      </button>
    </div>
  );
}
