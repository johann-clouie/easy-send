"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChainConfig } from "@/lib/chains";
import {
  fetchTronAssetBalance,
  fetchTrxBalance,
  sendTronTransaction,
  tronAddressFromPrivateKey,
} from "@/lib/tron";
import {
  ActionButtons,
  CharCount,
  SendFormShell,
  StatusMessage,
  StepBadge,
  SummaryGrid,
  type Status,
} from "./SendFormShell";

function isTronAddress(addr: string): boolean {
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(addr);
}

export function TronSendForm({ config }: { config: ChainConfig }) {
  const [sender, setSender] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const [gas, setGas] = useState("0");
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const total = useMemo(() => {
    const n = parseFloat(amount);
    return Number.isFinite(n) && n > 0 ? amount : "0";
  }, [amount]);

  const resolvedSender = useMemo(() => {
    if (privateKey.trim()) {
      return sender;
    }
    return sender;
  }, [privateKey, sender]);

  const loadBalance = useCallback(
    async (address: string) => {
      if (!isTronAddress(address)) return;
      try {
        const bal = await fetchTronAssetBalance(config, address);
        setBalance(bal);
      } catch {
        setBalance("0");
      }
      if (config.kind === "tron-trc20") {
        try {
          const trx = await fetchTrxBalance(address);
          setGas(parseFloat(trx).toFixed(4));
        } catch {
          setGas("0");
        }
      }
    },
    [config]
  );

  useEffect(() => {
    if (!privateKey.trim()) return;
    void tronAddressFromPrivateKey(privateKey)
      .then((addr) => {
        setSender(addr);
      })
      .catch(() => {
        /* typing */
      });
  }, [privateKey]);

  useEffect(() => {
    if (!isTronAddress(resolvedSender)) {
      setBalance("0");
      return;
    }
    void loadBalance(resolvedSender);
  }, [resolvedSender, loadBalance]);

  const handleClear = () => {
    setSender("");
    setPrivateKey("");
    setRecipient("");
    setAmount("");
    setBalance("0");
    setGas("0");
    setStatus({ type: "idle" });
  };

  const handleSend = async () => {
    setStatus({ type: "loading", message: "Sending on Tron…" });
    try {
      if (!isTronAddress(recipient)) throw new Error("Invalid Tron address");
      const txid = await sendTronTransaction(
        config,
        privateKey,
        recipient,
        amount
      );
      setStatus({ type: "success", message: `Sent! Tx: ${txid}` });
      if (isTronAddress(sender)) void loadBalance(sender);
    } catch (e) {
      setStatus({
        type: "error",
        message: e instanceof Error ? e.message : "Send failed",
      });
    }
  };

  return (
    <SendFormShell>
      <div>
        <div className="mb-2 flex items-center gap-2">
          <StepBadge n={1} />
          <label className="text-sm text-zinc-400">{config.addressLabel}</label>
          <CharCount value={sender} max={config.charMax} />
        </div>
        <input
          type="text"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder={config.addressPlaceholder}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-100 outline-none focus:border-sky-500"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <StepBadge n={2} />
          <label className="text-sm text-zinc-400">
            Your private key ({config.keyHint}) 🔑
          </label>
        </div>
        <input
          type="password"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder={config.keyHint}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-100 outline-none focus:border-amber-500/80"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <StepBadge n={3} />
          <label className="text-sm text-zinc-400">Transfer to address</label>
          <CharCount value={recipient} max={config.charMax} />
        </div>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder={config.addressPlaceholder}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-100 outline-none focus:border-emerald-500/80"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <StepBadge n={4} />
          <label className="text-sm text-zinc-400">Amount</label>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-sky-500"
          />
          <button
            type="button"
            onClick={() => setAmount(balance)}
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
          >
            max
          </button>
        </div>
      </div>

      <SummaryGrid
        balance={balance}
        gas={config.kind === "tron-trc20" ? gas : "—"}
        total={total}
        assetSymbol={config.assetSymbol}
        gasSymbol={
          config.kind === "tron-trc20" ? "TRX (balance)" : config.gasSymbol
        }
      />
      <StatusMessage status={status} />
      <p className="text-xs text-zinc-500">
        Tron transactions broadcast immediately (no separate hex step).
      </p>
      <ActionButtons
        onSend={() => void handleSend()}
        onClear={handleClear}
        loading={status.type === "loading"}
        showCopy={false}
      />
    </SendFormShell>
  );
}
