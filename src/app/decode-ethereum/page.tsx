import { DecodeEthereumForm } from "@/components/DecodeForm";
import { NetworkTabs } from "@/components/NetworkTabs";

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
