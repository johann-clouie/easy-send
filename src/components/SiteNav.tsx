import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteNav() {
  return (
    <nav className="border-b border-zinc-800/80 bg-zinc-950/50 px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link
          href="/"
          className="transition-opacity hover:opacity-90"
          aria-label={siteConfig.name}
        >
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={36}
            height={36}
            className="rounded-md"
            priority
          />
        </Link>
        <span className="text-xs text-zinc-500">Multi-chain send</span>
      </div>
    </nav>
  );
}
