/** Public site URL — required for absolute OG/Telegram/WhatsApp image URLs in production. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const siteConfig = {
  name: "Easy Send",
  legalName: "Easy Send",
  tagline: "Send crypto online — fast, simple, multi-chain",
  description:
    "Send Bitcoin, Ethereum, Tron, BNB, USDT, and USDC online. Sign transactions in your browser and broadcast to BTC, ETH, BSC, and Tron networks.",
  keywords: [
    "send crypto online",
    "bitcoin transaction",
    "ethereum send",
    "USDT BEP20",
    "USDT TRC20",
    "USDT ERC20",
    "USDC ERC20",
    "BNB transfer",
    "Tron TRX",
    "crypto transaction tool",
    "blockchain send",
  ],
  locale: "en_US",
  themeColor: "#0a0a0a",
  contactEmail: "support@easysend.app",
} as const;
