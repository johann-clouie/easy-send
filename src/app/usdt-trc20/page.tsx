import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";

export default function UsdtTrc20Page() {
  return <SendPage config={CHAINS["usdt-trc20"]} />;
}
