import { NetworkTabs } from "@/components/NetworkTabs";
import { PageHeader } from "@/components/PageHeader";
import { SendPageFooter } from "@/components/SendPageFooter";
import { ChainSendForm } from "@/components/ChainSendForm";
import type { ChainConfig } from "@/lib/chains";

export function SendPage({ config }: { config: ChainConfig }) {
  return (
    <div className="min-h-full flex-1 bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-10 sm:py-14">
        <PageHeader config={config} />
        <NetworkTabs />
        <ChainSendForm config={config} />
        <SendPageFooter config={config} />
      </main>
    </div>
  );
}
