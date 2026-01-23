import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import FooterNav from "../../_components/layout/footerNav/FooterNav";
import { ExpensesProvider } from "../../_components/context/expensesContext/ExpensesContext";
import ShareMsgDialog from "@/app/_components/elements/ShareMsgDialog";
import { Metadata } from "next";
import { ExpensesData, ExpensesLayoutProps} from "../types";

export const metadata: Metadata = {
    title: "WeBalance",
    icons: {
        icon: "/favicon.svg", // 一般的なファビコン
        shortcut: "/favicon.svg", // ショートカット用アイコン（`icon` と同じでOK）
        apple: "/favicon.svg",
    },
    description: "カップル専用支出管理アプリWeBalance。WeBalanceは、カップルの支出を簡単に管理し、フェアに分担するためのアプリです。お互いに支払った金額を入力することで、月々の負担金額を計算し、どちらがどれだけ支払い合うべきかを自動で算出します。支払い比率を自由に設定でき、柔軟に使えるので、どんなライフスタイルにも対応。あなたの大切な人と、もっとスムーズにお金のやりとりをしましょう。",
};

export default async function AppLayout({ children, params }: ExpensesLayoutProps) {
    const supabase = await createClient();
    const paramsData = await params;
    const { coupleId, yearMonth } = paramsData;

    const yearMonthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!yearMonthRegex.test(yearMonth)) {
        notFound();
    }

    const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('id, user_id, date, amount, item, year_month, couple_id')
        .eq('couple_id', coupleId)
        .eq('year_month', yearMonth)
        .order("created_at", { ascending: false })
        .returns<ExpensesData[]>();


    if (expensesError) {
        redirect("/error");
    }

    return (
        <ExpensesProvider
            initialExpenses={expensesData}
        >
            <div className="grid grid-rows-[auto_1fr_auto] max-h-screen max-w-[430px] mx-auto relative">
                <main className="pb-[75px] pt-3">
                    {children}
                    <ShareMsgDialog />
                </main>
                <FooterNav />
            </div>
        </ExpensesProvider>
    );
}
