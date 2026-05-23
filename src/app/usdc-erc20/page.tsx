import { SendPage } from "@/components/SendPage";
import { CHAINS } from "@/lib/chains";

export default function UsdcErc20Page() {
  return <SendPage config={CHAINS["usdc-erc20"]} />;
}
