import type { Metadata } from "next";
import { Barlow, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin-ext"],
  variable: "--font-noto-sans-tc"
});

const barlow = Barlow({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ['latin'],
  variable: "--font-barlow"
});

export const metadata: Metadata = {
  title: "臺灣即時天氣預報",
  description: "臺灣即時天氣預報(資料來源：中央氣象署)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body
        className={`${barlow.variable} ${notoSansTC.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
