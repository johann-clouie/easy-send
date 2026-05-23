import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";
import { createPageMetadata } from "@/lib/seo";

const chain = CHAINS.ethereum;

export const metadata = createPageMetadata({
  title: chain.title,
  description: chain.subtitle,
  path: chain.path,
  keywords: ["send ethereum", "ETH transfer", "ethereum transaction online"],
});

export default function EthereumPage() {
  return <SendPage config={chain} />;
}
