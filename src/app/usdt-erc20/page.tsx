import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";

export default function UsdtErc20Page() {
  return <SendPage config={CHAINS["usdt-erc20"]} />;
}
