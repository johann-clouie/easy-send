import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";
import { createPageMetadata } from "@/lib/seo";

const chain = CHAINS.bnb;

export const metadata = createPageMetadata({
  title: chain.title,
  description: chain.subtitle,
  path: chain.path,
  keywords: ["send BNB", "BSC BNB transfer", "Binance Smart Chain send"],
});

export default function BnbPage() {
  return <SendPage config={chain} />;
}
