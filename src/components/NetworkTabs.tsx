"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHAINS, NETWORK_TABS, type ChainId } from "@/lib/chains";
import type { CryptoSlug } from "./CryptoIcon";

const TAB_ICONS: Record<ChainId, CryptoSlug> = {
  bitcoin: "btc",
  ethereum: "eth",
  tron: "trx",
  bnb: "bnb",
  "usdt-bep20": "usdt",
  "usdt-trc20": "usdt",
  "usdt-erc20": "usdt",
  "usdc-erc20": "usdc",
};

const UTILS = [
  { label: "Decode Bitcoin transaction", href: "/decode-bitcoin", icon: "btc" as const },
  { label: "Decode Ethereum transaction", href: "/decode-ethereum", icon: "eth" as const },
] as const;

function TabIcon({ slug }: { slug: CryptoSlug }) {
  return (
    <Image
      src={`/crypto/${slug}.svg`}
      alt=""
      width={18}
      height={18}
      className="shrink-0 rounded-full"
      aria-hidden
    />
  );
}

function Tab({
  label,
  href,
  active,
  icon,
}: {
  label: string;
  href: string;
  active: boolean;
  icon?: CryptoSlug;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors";
  const activeCls =
    "border-sky-400 bg-sky-500/10 text-white shadow-[0_0_12px_rgba(56,189,248,0.35)]";
  const idleCls =
    "border-zinc-700/80 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/80 hover:text-zinc-200";

  return (
    <Link href={href} className={`${base} ${active ? activeCls : idleCls}`}>
      {icon && <TabIcon slug={icon} />}
      {label}
    </Link>
  );
}

export function NetworkTabs() {
  const pathname = usePathname();

  return (
    <div className="flex w-full max-w-4xl flex-col gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {NETWORK_TABS.map(({ label, chainId }) => {
          const chain = CHAINS[chainId];
          return (
            <Tab
              key={chainId}
              label={label}
              href={chain.path}
              active={pathname === chain.path}
              icon={TAB_ICONS[chainId]}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {UTILS.map((u) => (
          <Tab
            key={u.href}
            label={u.label}
            href={u.href}
            active={pathname === u.href}
            icon={u.icon}
          />
        ))}
      </div>
    </div>
  );
}
