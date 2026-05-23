import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";

export default function BnbPage() {
  return <SendPage config={CHAINS.bnb} />;
}
