import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";
import { createPageMetadata } from "@/lib/seo";

const chain = CHAINS["usdt-bep20"];

export const metadata = createPageMetadata({
  title: chain.title,
  description: `${chain.subtitle} Sign and broadcast USDT on BSC (BEP20) in your browser.`,
  path: "/",
  keywords: ["USDT BEP20", "BSC send", "Tether BEP20", "Binance Smart Chain USDT"],
});

export default function Home() {
  return <SendPage config={chain} />;
}
