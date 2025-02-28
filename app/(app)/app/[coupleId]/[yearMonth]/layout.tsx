import { createClient } from "@/utils/supabase/server";
import Header from "../../_components/layout/header/Header";
import { notFound, redirect } from "next/navigation";
import { getSignedUrl } from "@/lib/supabese/server/getImgUrl";
import FooterNav from "../../_components/layout/footerNav/FooterNav";
import { CoupleProvider } from "../../_components/context/coupleContext/CoupleContext";
import { ExpensesProvider } from "../../_components/context/expensesContext/ExpensesContext";
import { getMonthlyTotal } from "./functions";
import ShareMsgDialog from "@/app/_components/elements/ShareMsgDialog";
import { Metadata } from "next";
import { CoupleData, ExpensesData, ExpensesLayoutProps, FormattedUserData } from "../types";

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
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !user) {
        redirect('/');
    }

    const paramsData = await params;
    const { coupleId, yearMonth } = paramsData;
    const yearMonthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

    if (!yearMonthRegex.test(yearMonth)) {
        notFound();
    }

    const fetchCouple = supabase
        .from('couples')
        .select('id,custom_couple_id,image_url,primary_user:primary_user_id(id,name,icon_url), partner_user:partner_user_id(id,name,icon_url)')
        .or(`primary_user_id.eq.${user.id},partner_user_id.eq.${user.id}`)
        .single<CoupleData>();
    const fetchExpenses = supabase
        .from('expenses')
        .select('id, user_id, date, amount, item, year_month, couple_id')
        .eq('couple_id', coupleId)
        .eq('year_month', yearMonth)
        .order("created_at", { ascending: false })
        .returns<ExpensesData[]>();

    const [
        result_couples,
        result_expenses
    ] = await Promise.all([
        fetchCouple,
        fetchExpenses
    ]);

    if (result_couples.error) {
        redirect('/setup');
    }

    if (result_expenses.error) {
        redirect("/error");
    }

    const { id, custom_couple_id, image_url, primary_user, partner_user } = result_couples.data;

    if (coupleId !== custom_couple_id) {
        notFound();
    }
    const [primary_user_img, partner_user_img, headerImg] = await Promise.all([
        getSignedUrl('user-icons', primary_user.icon_url),
        getSignedUrl('user-icons', partner_user?.icon_url),
        getSignedUrl('couple-images', image_url)
    ]);

    const isPrimaryUser = user.id === primary_user.id;

    const currentUser: FormattedUserData = {
        id: isPrimaryUser ? primary_user.id : partner_user?.id,
        name: isPrimaryUser ? primary_user.name : partner_user?.name,
        icon: isPrimaryUser ? primary_user_img : partner_user_img,
    };

    const partner: FormattedUserData | null = partner_user && {
        id: isPrimaryUser ? partner_user.id : primary_user.id,
        name: isPrimaryUser ? partner_user.name : primary_user.name,
        icon: isPrimaryUser ? partner_user_img : primary_user_img,
    };

    const couple = {
        id: id,
        coupleId: custom_couple_id,
        headerImg: headerImg
    }

    const expenses = result_expenses.data;

    const monthlyTotal = getMonthlyTotal(expenses, primary_user.id)

    return (
        <CoupleProvider
            initialCurrentUser={currentUser}
            initialPartner={partner}
            initialCouple={couple}
            isPrimaryUser={isPrimaryUser}
            primaryUserId={primary_user.id}
        >
            <ExpensesProvider
                initialMonthlyTotal={monthlyTotal}
                initialExpenses={expenses}
                primaryUserId={primary_user.id}
            >
                <div className="grid grid-rows-[auto_1fr_auto] max-h-screen max-w-[430px] mx-auto relative">
                    <Header />
                    <main className="pb-[75px] pt-3">
                        {children}
                        {!partner && <ShareMsgDialog coupleId={couple.coupleId} />}
                    </main>
                    <FooterNav />
                </div>
            </ExpensesProvider>
        </CoupleProvider>
    );
}
