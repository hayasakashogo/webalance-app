
import { Metadata } from "next";
import Footer from "../_components/layout/footer/Footer";

export const metadata: Metadata = {
    title: "WeBalance",
    icons: {
        icon: "/favicon.svg", // 一般的なファビコン
        shortcut: "/favicon.svg", // ショートカット用アイコン（`icon` と同じでOK）
        apple: "/favicon.svg",
    },
    description: "カップル専用支出管理アプリWeBalance。WeBalanceは、カップルの支出を簡単に管理し、フェアに分担するためのアプリです。お互いに支払った金額を入力することで、月々の負担金額を計算し、どちらがどれだけ支払い合うべきかを自動で算出します。支払い比率を自由に設定でき、柔軟に使えるので、どんなライフスタイルにも対応。あなたの大切な人と、もっとスムーズにお金のやりとりをしましょう。",
};

export default async function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
}
