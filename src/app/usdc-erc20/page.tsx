import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";
import { createPageMetadata } from "@/lib/seo";

const chain = CHAINS["usdc-erc20"];

export const metadata = createPageMetadata({
  title: chain.title,
  description: `${chain.subtitle} Send USD Coin on Ethereum (ERC20).`,
  path: chain.path,
  keywords: ["USDC ERC20", "Ethereum USDC", "USD Coin send"],
});

export default function UsdcErc20Page() {
  return <SendPage config={chain} />;
}
