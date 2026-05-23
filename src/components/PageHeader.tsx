import type { ChainConfig } from "@/lib/chains";
import { CryptoIcon, getChainIconSlugs } from "./CryptoIcon";

export function PageHeader({ config }: { config: ChainConfig }) {
  const icons = getChainIconSlugs(config);

  return (
    <header className="flex w-full max-w-4xl flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {config.title}
      </h1>
      <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
        {config.subtitle}
        {config.contractAddress && config.contractLink && (
          <>
            {" "}
            Contract:{" "}
            <a
              href={config.contractLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sky-400 hover:underline"
            >
              {config.contractAddress}
            </a>
          </>
        )}
      </p>
      <div className="flex items-center justify-center gap-5 pt-1">
        {icons.map((slug) => (
          <CryptoIcon key={slug} slug={slug} size={80} />
        ))}
      </div>
    </header>
  );
}
