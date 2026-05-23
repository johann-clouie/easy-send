import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";

export default function EthereumPage() {
  return <SendPage config={CHAINS.ethereum} />;
}
