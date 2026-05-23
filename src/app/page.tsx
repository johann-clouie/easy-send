import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";

export default function Home() {
  return <SendPage config={CHAINS["usdt-bep20"]} />;
}
