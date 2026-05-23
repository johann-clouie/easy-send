import { DecodeEthereumForm } from "@/components/DecodeForm";
import { NetworkTabs } from "@/components/NetworkTabs";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Decode Ethereum transaction",
  description:
    "Paste a signed Ethereum transaction hex to view to, from, value, gas, and data.",
  path: "/decode-ethereum",
  keywords: ["decode ethereum transaction", "ETH raw tx", "ethereum hex decoder"],
});

export default function DecodeEthereumPage() {
  return (
    <div className="min-h-full flex-1 bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-10 sm:py-14">
        <h1 className="text-2xl font-bold text-white">Decode Ethereum transaction</h1>
        <NetworkTabs />
        <DecodeEthereumForm />
      </main>
    </div>
  );
}
