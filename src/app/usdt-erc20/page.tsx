import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";
import { createPageMetadata } from "@/lib/seo";

const chain = CHAINS["usdt-erc20"];

export const metadata = createPageMetadata({
  title: chain.title,
  description: `${chain.subtitle} Send Tether on Ethereum (ERC20).`,
  path: chain.path,
  keywords: ["USDT ERC20", "Ethereum USDT", "Tether ERC20 send"],
});

export default function UsdtErc20Page() {
  return <SendPage config={chain} />;
}
