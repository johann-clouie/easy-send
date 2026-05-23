"use client";

import type { ChainConfig } from "@/lib/chains";
import { BitcoinSendForm } from "./BitcoinSendForm";
import { EvmSendForm } from "./EvmSendForm";
import { TronSendForm } from "./TronSendForm";

export function ChainSendForm({ config }: { config: ChainConfig }) {
  if (config.kind === "bitcoin") return <BitcoinSendForm config={config} />;
  if (config.kind === "tron-native" || config.kind === "tron-trc20") {
    return <TronSendForm config={config} />;
  }
  return <EvmSendForm config={config} />;
}
