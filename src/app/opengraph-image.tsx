import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — send cryptocurrency online`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logoPath = join(process.cwd(), "public", "logo.png");
  const logoBuffer = await readFile(logoPath);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0a0a0a 0%, #111827 50%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoBase64} width={200} height={200} alt="" />
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#f8fafc",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            maxWidth: 800,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
            fontSize: 20,
            color: "#38bdf8",
          }}
        >
          <span>BTC</span>
          <span>·</span>
          <span>ETH</span>
          <span>·</span>
          <span>TRX</span>
          <span>·</span>
          <span>BNB</span>
          <span>·</span>
          <span>USDT</span>
          <span>·</span>
          <span>USDC</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
