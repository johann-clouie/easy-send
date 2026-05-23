import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";

export default function BitcoinPage() {
  return <SendPage config={CHAINS.bitcoin} />;
}
