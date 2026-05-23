import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";
import { createPageMetadata } from "@/lib/seo";

const chain = CHAINS.bitcoin;

export const metadata = createPageMetadata({
  title: chain.title,
  description: chain.subtitle,
  path: chain.path,
  keywords: ["send bitcoin", "BTC transaction", "bitcoin transfer online"],
});

export default function BitcoinPage() {
  return <SendPage config={chain} />;
}
