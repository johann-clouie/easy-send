"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChainConfig } from "@/lib/chains";
import {
  broadcastBtcTx,
  buildAndSignBtcTx,
  estimateBtcFee,
  fetchBtcBalance,
  isValidBtcAddress,
  keyPairFromInput,
} from "@/lib/bitcoin";
import {
  AntiAutofillForm,
  AmountInput,
  RecipientAddressInput,
  SenderAddressInput,
  SigningKeyInput,
} from "./SendInputs";
import {
  ActionButtons,
  CharCount,
  SendFormShell,
  SignedHexBox,
  StatusMessage,
  StepBadge,
  SummaryGrid,
  type Status,
} from "./SendFormShell";

export function BitcoinSendForm({ config }: { config: ChainConfig }) {
  const [sender, setSender] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const [gas, setGas] = useState("0");
  const [signedHex, setSignedHex] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const total = useMemo(() => {
    const n = parseFloat(amount);
    return Number.isFinite(n) && n > 0 ? amount : "0";
  }, [amount]);

  const resolvedSender = useMemo(() => {
    if (privateKey.trim()) {
      try {
        return keyPairFromInput(privateKey).address;
      } catch {
        return sender;
      }
    }
    return sender;
  }, [privateKey, sender]);

  const loadBalance = useCallback(async (address: string) => {
    if (!isValidBtcAddress(address)) return;
    try {
      setBalance(await fetchBtcBalance(address));
    } catch {
      setBalance("0");
    }
  }, []);

  useEffect(() => {
    if (!resolvedSender || !isValidBtcAddress(resolvedSender)) {
      setBalance("0");
      return;
    }
    void loadBalance(resolvedSender);
    void estimateBtcFee(resolvedSender)
      .then(setGas)
      .catch(() => setGas("0"));
  }, [resolvedSender, loadBalance]);

  useEffect(() => {
    if (!privateKey.trim()) return;
    try {
      setSender(keyPairFromInput(privateKey).address);
    } catch {
      /* typing */
    }
  }, [privateKey]);

  const handleClear = () => {
    setSender("");
    setPrivateKey("");
    setRecipient("");
    setAmount("");
    setBalance("0");
    setGas("0");
    setSignedHex("");
    setStatus({ type: "idle" });
  };

  const sign = async () => {
    if (!isValidBtcAddress(recipient)) throw new Error("Invalid Bitcoin address");
    const { hex, feeBtc } = await buildAndSignBtcTx(privateKey, recipient, amount);
    setSignedHex(hex);
    setGas(feeBtc);
    return hex;
  };

  const handleSend = async () => {
    setStatus({ type: "loading", message: "Broadcasting to Bitcoin…" });
    try {
      const hex = signedHex || (await sign());
      if (!signedHex) setSignedHex(hex);
      const txid = await broadcastBtcTx(hex);
      setStatus({ type: "success", message: `Sent! Tx: ${txid}` });
      if (resolvedSender) void loadBalance(resolvedSender);
    } catch (e) {
      setStatus({
        type: "error",
        message: e instanceof Error ? e.message : "Broadcast failed",
      });
    }
  };

  const handleCopy = async () => {
    try {
      const hex = signedHex || (await sign());
      await navigator.clipboard.writeText(hex);
      setStatus({ type: "success", message: "Copied signed hex." });
    } catch (e) {
      setStatus({
        type: "error",
        message: e instanceof Error ? e.message : "Copy failed",
      });
    }
  };

  return (
    <SendFormShell>
      <AntiAutofillForm>
      <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <StepBadge n={1} />
          <label className="text-sm text-zinc-400" htmlFor="chain-sender-address">
            {config.addressLabel}
          </label>
          <CharCount value={sender} max={config.charMax} />
        </div>
        <SenderAddressInput
          id="chain-sender-address"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder={config.addressPlaceholder}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <StepBadge n={2} />
          <label className="text-sm text-zinc-400" htmlFor="chain-signing-key">
            Your private key (WIF or hex) 🔑
          </label>
        </div>
        <SigningKeyInput
          id="chain-signing-key"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="WIF or 64-char hex"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <StepBadge n={3} />
          <label className="text-sm text-zinc-400" htmlFor="chain-recipient-address">
            Transfer to address
          </label>
          <CharCount value={recipient} max={config.charMax} />
        </div>
        <RecipientAddressInput
          id="chain-recipient-address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder={config.addressPlaceholder}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <StepBadge n={4} />
          <label className="text-sm text-zinc-400" htmlFor="chain-transfer-amount">
            Amount
          </label>
        </div>
        <div className="flex gap-2">
          <AmountInput
            id="chain-transfer-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
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
        gas={gas}
        total={total}
        assetSymbol={config.assetSymbol}
        gasSymbol={config.gasSymbol}
      />
      <StatusMessage status={status} />
      <SignedHexBox hex={signedHex} />
      <ActionButtons
        onSend={() => void handleSend()}
        onCopy={() => void handleCopy()}
        onClear={handleClear}
        loading={status.type === "loading"}
      />
      </div>
      </AntiAutofillForm>
    </SendFormShell>
  );
}
