import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";
import { createPageMetadata } from "@/lib/seo";

const chain = CHAINS["usdt-trc20"];

export const metadata = createPageMetadata({
  title: chain.title,
  description: `${chain.subtitle} Send Tether on Tron (TRC20).`,
  path: chain.path,
  keywords: ["USDT TRC20", "Tron USDT", "Tether TRC20 send"],
});

export default function UsdtTrc20Page() {
  return <SendPage config={chain} />;
}
