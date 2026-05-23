import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";
import { createPageMetadata } from "@/lib/seo";

const chain = CHAINS.tron;

export const metadata = createPageMetadata({
  title: chain.title,
  description: chain.subtitle,
  path: chain.path,
  keywords: ["send tron", "TRX transfer", "tron transaction online"],
});

export default function TronPage() {
  return <SendPage config={chain} />;
}
