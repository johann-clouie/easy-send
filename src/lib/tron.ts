import type { ChainConfig } from "./chains";

const USDT_TRC20 = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

type TronWebInstance = {
  address: {
    fromPrivateKey: (pk: string) => { base58: string };
  };
  trx: {
    getBalance: (addr: string) => Promise<number>;
    getAccount: (addr: string) => Promise<unknown>;
    sendTransaction: (
      to: string,
      amount: number,
      pk: string
    ) => Promise<{ txid?: string; transaction?: { txID?: string } }>;
  };
  contract: () => {
    at: (address: string) => Promise<{
      balanceOf: (addr: string) => { call: () => Promise<bigint | number> };
      transfer: (
        to: string,
        amount: string | number
      ) => {
        send: (opts: { feeLimit: number }) => Promise<string>;
      };
    }>;
  };
  isAddress: (addr: string) => boolean;
};

async function getTronWeb(privateKey?: string): Promise<TronWebInstance> {
  const mod = await import("tronweb");
  const TronWebCtor = mod.default.TronWeb ?? mod.default;
  return new TronWebCtor({
    fullHost:
      process.env.NEXT_PUBLIC_TRON_RPC_URL ?? "https://api.trongrid.io",
    privateKey: privateKey?.replace(/^0x/i, "") || undefined,
  }) as unknown as TronWebInstance;
}

export function normalizeTronPrivateKey(input: string): string {
  const trimmed = input.trim().replace(/^0x/i, "");
  if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    throw new Error("Tron requires a 64-character hex private key");
  }
  return trimmed;
}

export async function tronAddressFromPrivateKey(
  privateKey: string
): Promise<string> {
  const pk = normalizeTronPrivateKey(privateKey);
  const tw = await getTronWeb(pk);
  const addr = tw.address.fromPrivateKey(pk);
  if (typeof addr === "string") return addr;
  return addr.base58;
}

export async function fetchTrxBalance(address: string): Promise<string> {
  const tw = await getTronWeb();
  const sun = await tw.trx.getBalance(address);
  return (sun / 1e6).toFixed(6);
}

export async function fetchTrc20Balance(
  holder: string,
  tokenAddress: string,
  decimals: number
): Promise<string> {
  const tw = await getTronWeb();
  const contract = await tw.contract().at(tokenAddress);
  const raw = await contract.balanceOf(holder).call();
  const n = typeof raw === "bigint" ? Number(raw) : Number(raw);
  return (n / 10 ** decimals).toFixed(decimals === 6 ? 2 : 4);
}

export async function fetchTronAssetBalance(
  config: ChainConfig,
  address: string
): Promise<string> {
  if (config.kind === "tron-trc20" && config.tronTokenAddress) {
    return fetchTrc20Balance(
      address,
      config.tronTokenAddress,
      config.tokenDecimals ?? 6
    );
  }
  return fetchTrxBalance(address);
}

export function isValidTronAddress(
  tw: TronWebInstance,
  addr: string
): boolean {
  return tw.isAddress(addr);
}

export async function sendTronNative(
  privateKey: string,
  to: string,
  amountTrx: string
): Promise<string> {
  const pk = normalizeTronPrivateKey(privateKey);
  const tw = await getTronWeb(pk);
  if (!tw.isAddress(to)) throw new Error("Invalid Tron address");
  const sun = Math.round(parseFloat(amountTrx) * 1e6);
  if (!Number.isFinite(sun) || sun <= 0) throw new Error("Enter a valid amount");
  const result = await tw.trx.sendTransaction(to, sun, pk);
  return result.txid ?? result.transaction?.txID ?? "sent";
}

export async function sendTrc20(
  privateKey: string,
  tokenAddress: string,
  to: string,
  amount: string,
  decimals: number
): Promise<string> {
  const pk = normalizeTronPrivateKey(privateKey);
  const tw = await getTronWeb(pk);
  if (!tw.isAddress(to)) throw new Error("Invalid Tron address");
  const contract = await tw.contract().at(tokenAddress);
  const smallest = Math.round(parseFloat(amount) * 10 ** decimals);
  if (!Number.isFinite(smallest) || smallest <= 0) {
    throw new Error("Enter a valid amount");
  }
  const txid = await contract
    .transfer(to, smallest)
    .send({ feeLimit: 100_000_000 });
  return txid;
}

export async function sendTronTransaction(
  config: ChainConfig,
  privateKey: string,
  recipient: string,
  amount: string
): Promise<string> {
  if (config.kind === "tron-trc20") {
    const token = config.tronTokenAddress ?? USDT_TRC20;
    return sendTrc20(
      privateKey,
      token,
      recipient,
      amount,
      config.tokenDecimals ?? 6
    );
  }
  return sendTronNative(privateKey, recipient, amount);
}
