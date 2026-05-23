import type { ReactNode } from "react";
import type { ChainConfig } from "@/lib/chains";

function ExplorerLink({ config }: { config: ChainConfig }) {
  return (
    <a
      href={config.explorer}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sky-400 hover:underline"
    >
      {config.explorerName}
    </a>
  );
}

function footerFor(config: ChainConfig): ReactNode[] {
  switch (config.kind) {
    case "bitcoin":
      return [
        <>
          Fill in your address, private key (WIF or hex), recipient, and amount.
          Click <strong className="text-zinc-300">Send transaction</strong> to
          build, sign, and publish to the Bitcoin network—or use{" "}
          <strong className="text-zinc-300">Copy hex</strong> to broadcast the
          signed raw transaction elsewhere.
        </>,
        <>
          Network fees are deducted from your balance in BTC. Use{" "}
          <strong className="text-zinc-300">max</strong> only if you intend to
          sweep the account; leave room for the miner fee.
        </>,
        <>
          Confirmed payments are final. There is no undo after a transaction is
          included in a block.
        </>,
        <>
          Track status and confirmations on{" "}
          <ExplorerLink config={config} />.
        </>,
      ];

    case "evm-native":
      return [
        <>
          Enter your wallet details, recipient, and amount.{" "}
          <strong className="text-zinc-300">Send transaction</strong> signs and
          broadcasts {config.assetSymbol} on {config.networkName}.{" "}
          <strong className="text-zinc-300">Copy hex</strong> saves the signed
          raw transaction if you prefer another broadcaster.
        </>,
        <>
          Gas is paid in {config.gasSymbol}. Make sure the sending address holds
          enough {config.gasSymbol} in addition to the amount you are sending.
        </>,
        <>
          After the transaction is mined, it cannot be reversed.
        </>,
        <>
          View the transaction on{" "}
          <ExplorerLink config={config} />.
        </>,
      ];

    case "evm-erc20":
      return [
        <>
          This form sends {config.assetSymbol} (ERC-20/BEP-20), not the chain’s
          native coin. <strong className="text-zinc-300">Send transaction</strong>{" "}
          signs and broadcasts on {config.networkName};{" "}
          <strong className="text-zinc-300">Copy hex</strong> exports the signed
          transaction for manual broadcast.
        </>,
        <>
          You still need {config.gasSymbol} in the same wallet to pay gas. If the
          send fails with an insufficient-funds error, top up {config.gasSymbol}{" "}
          first—the token balance alone is not enough.
        </>,
        <>
          Token transfers are irreversible once confirmed on-chain.
        </>,
        <>
          Look up the contract and your transfer on{" "}
          <ExplorerLink config={config} />.
        </>,
      ];

    case "tron-native":
      return [
        <>
          Provide your Tron address, hex private key, recipient, and amount, then
          press <strong className="text-zinc-300">Send transaction</strong>.
          Tron broadcasts immediately from your browser—there is no separate hex
          step for native TRX.
        </>,
        <>
          Bandwidth and energy may apply; small TRX reserves help avoid failed
          sends.
        </>,
        <>
          Completed transfers cannot be canceled.
        </>,
        <>
          Follow the transaction on{" "}
          <ExplorerLink config={config} />.
        </>,
      ];

    case "tron-trc20":
      return [
        <>
          Send {config.assetSymbol} (TRC-20) on Tron. Fill the form and click{" "}
          <strong className="text-zinc-300">Send transaction</strong>—the token
          contract is invoked and the transfer is submitted to the network from
          your browser.
        </>,
        <>
          TRC-20 moves consume TRX for fees. Keep some TRX on the sending address;
          the {config.assetSymbol} balance does not cover network costs.
        </>,
        <>
          Confirmed token transfers are permanent.
        </>,
        <>
          Verify the transfer on{" "}
          <ExplorerLink config={config} />.
        </>,
      ];
  }
}

export function SendPageFooter({ config }: { config: ChainConfig }) {
  const paragraphs = footerFor(config);

  return (
    <footer className="max-w-2xl space-y-4 text-center text-sm leading-relaxed text-zinc-500">
      {paragraphs.map((content, i) => (
        <p key={i}>{content}</p>
      ))}
      <p className="border-t border-zinc-800/80 pt-4 text-xs text-zinc-600">
        Private keys are processed locally in your browser and are not stored on
        our servers. Only sign on devices you trust.
      </p>
    </footer>
  );
}
