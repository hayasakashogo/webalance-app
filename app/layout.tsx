import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { colors } from "@/lib/colors/colors";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WeBalance",
  icons:{
    icon: "/favicon.svg", 
    shortcut: "/favicon.svg", 
    apple: "/favicon.svg", 
  },
  description: "カップル専用支出管理アプリWeBalance。WeBalanceは、カップルの支出を簡単に管理し、フェアに分担するためのアプリです。お互いに支払った金額を入力することで、月々の負担金額を計算し、どちらがどれだけ支払い合うべきかを自動で算出します。支払い比率を自由に設定でき、柔軟に使えるので、どんなライフスタイルにも対応。あなたの大切な人と、もっとスムーズにお金のやりとりをしましょう。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: colors.base }}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
