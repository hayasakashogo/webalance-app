import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
    title: "WeBalance",
    icons: {
        icon: "/favicon.svg", // 一般的なファビコン
        shortcut: "/favicon.svg", // ショートカット用アイコン（`icon` と同じでOK）
        apple: "/favicon.svg",
    },
    description: "カップル専用支出管理アプリWeBalance。WeBalanceは、カップルの支出を簡単に管理し、フェアに分担するためのアプリです。お互いに支払った金額を入力することで、月々の負担金額を計算し、どちらがどれだけ支払い合うべきかを自動で算出します。支払い比率を自由に設定でき、柔軟に使えるので、どんなライフスタイルにも対応。あなたの大切な人と、もっとスムーズにお金のやりとりをしましょう。",
};
export default async function FormLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid min-h-screen grid-rows-[auto_1fr]">
            <header
                className="bg-primary p-6"
                style={{
                    borderBottomLeftRadius: "50% 50%",
                    borderBottomRightRadius: "50% 50%",
                }}

            >
                <h1 className='text-center font-bold text-white text-xl'>
                    <Link href={"/"}>WeBalance</Link>
                </h1>
            </header>

            <main className='flex items-center justify-center px-4'>
                {children}
            </main>
        </div>
    );
}