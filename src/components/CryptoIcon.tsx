import Image from "next/image";

/** Slugs match files in /public/crypto/ (from cryptocurrency-icons). */
export type CryptoSlug = "btc" | "eth" | "trx" | "bnb" | "usdt" | "usdc";

const LABELS: Record<CryptoSlug, string> = {
  btc: "Bitcoin",
  eth: "Ethereum",
  trx: "Tron",
  bnb: "BNB",
  usdt: "Tether USDT",
  usdc: "USD Coin",
};

export function CryptoIcon({
  slug,
  size = 72,
}: {
  slug: CryptoSlug;
  size?: number;
}) {
  const pad = Math.round(size * 0.18);

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-zinc-900/90 ring-2 ring-zinc-700/50 shadow-lg"
      style={{ width: size, height: size }}
    >
      <Image
        src={`/crypto/${slug}.svg`}
        alt={LABELS[slug]}
        width={size - pad * 2}
        height={size - pad * 2}
        className="rounded-full"
        priority
      />
    </div>
  );
}

export function getChainIconSlugs(config: {
  id: string;
  assetSymbol: string;
  gasSymbol: string;
  kind: string;
}): CryptoSlug[] {
  const asset = config.assetSymbol.toLowerCase() as CryptoSlug;
  const gas = config.gasSymbol.toLowerCase() as CryptoSlug;

  if (config.kind === "evm-erc20" || config.kind === "tron-trc20") {
    if (asset === gas) return [asset];
    return [asset, gas];
  }

  const single: Record<string, CryptoSlug> = {
    bitcoin: "btc",
    ethereum: "eth",
    tron: "trx",
    bnb: "bnb",
  };
  const slug = single[config.id];
  if (slug) return [slug];
  return [asset];
}
