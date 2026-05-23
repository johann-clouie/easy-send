import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";

export default function TronPage() {
  return <SendPage config={CHAINS.tron} />;
}
