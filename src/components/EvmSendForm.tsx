"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { isAddress } from "ethers";
import type { ChainConfig } from "@/lib/chains";
import {
  broadcastEvmTransaction,
  estimateEvmGasCost,
  fetchAssetBalance,
  signEvmTransaction,
} from "@/lib/evm";
import { walletFromPrivateKey } from "@/lib/keys";
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

export function EvmSendForm({ config }: { config: ChainConfig }) {
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
        return walletFromPrivateKey(privateKey).address;
      } catch {
        return sender;
      }
    }
    return sender;
  }, [privateKey, sender]);

  const loadBalance = useCallback(
    async (address: string) => {
      if (!isAddress(address)) return;
      try {
        const bal = await fetchAssetBalance(config, address);
        const decimals = config.kind === "evm-erc20" ? 2 : 6;
        setBalance(parseFloat(bal).toFixed(decimals));
      } catch {
        setBalance("0");
      }
    },
    [config]
  );

  useEffect(() => {
    if (!isAddress(resolvedSender)) {
      setBalance("0");
      return;
    }
    void loadBalance(resolvedSender);
  }, [resolvedSender, loadBalance]);

  useEffect(() => {
    if (
      isAddress(resolvedSender) &&
      isAddress(recipient) &&
      amount &&
      privateKey.trim()
    ) {
      void estimateEvmGasCost(config, privateKey, resolvedSender, recipient, amount)
        .then((g) => setGas(parseFloat(g).toFixed(8)))
        .catch(() => setGas("0"));
    }
  }, [config, resolvedSender, recipient, amount, privateKey]);

  useEffect(() => {
    if (!privateKey.trim()) return;
    try {
      setSender(walletFromPrivateKey(privateKey).address);
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
    const hex = await signEvmTransaction(config, privateKey, recipient, amount);
    setSignedHex(hex);
    return hex;
  };

  const handleSend = async () => {
    setStatus({ type: "loading", message: `Broadcasting to ${config.networkName}…` });
    try {
      const hex = signedHex || (await sign());
      if (!signedHex) setSignedHex(hex);
      const hash = await broadcastEvmTransaction(config, hex);
      setStatus({ type: "success", message: `Sent! Tx: ${hash}` });
      if (isAddress(resolvedSender)) void loadBalance(resolvedSender);
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
            Your private key ({config.keyHint}) 🔑
          </label>
        </div>
        <SigningKeyInput
          id="chain-signing-key"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder={config.keyHint}
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
