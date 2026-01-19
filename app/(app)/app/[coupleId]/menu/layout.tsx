import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getSignedUrl } from "@/lib/supabese/server/getImgUrl";
import { CoupleProvider } from "../../_components/context/coupleContext/CoupleContext";
import { Metadata } from "next";
import { CoupleData, ExpensesLayoutProps_Menu, FormattedUserData } from "../types";
export const metadata: Metadata = {
    title: "WeBalance",
    icons: {
        icon: "/favicon.svg", // 一般的なファビコン
        shortcut: "/favicon.svg", // ショートカット用アイコン（`icon` と同じでOK）
        apple: "/favicon.svg",
    },
    description: "カップル専用支出管理アプリWeBalance。WeBalanceは、カップルの支出を簡単に管理し、フェアに分担するためのアプリです。お互いに支払った金額を入力することで、月々の負担金額を計算し、どちらがどれだけ支払い合うべきかを自動で算出します。支払い比率を自由に設定でき、柔軟に使えるので、どんなライフスタイルにも対応。あなたの大切な人と、もっとスムーズにお金のやりとりをしましょう。",
};

export const revalidate = 60;
export default async function AppLayout({ children, params }: ExpensesLayoutProps_Menu
) {
    const supabase = await createClient();
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !user) {
        redirect('/');
    }

    const paramsData = await params;
    const { coupleId } = paramsData;

    const { data, error } = await supabase
        .from('couples')
        .select('id,custom_couple_id,image_url,primary_user:primary_user_id(id,name,icon_url), partner_user:partner_user_id(id,name,icon_url)')
        .or(`primary_user_id.eq.${user.id},partner_user_id.eq.${user.id}`)
        .returns<CoupleData[]>();

    if (error) {
        redirect("/error");
    }

    if (!data || data.length == 0) {
        redirect('/setup');
    }

    const { id, custom_couple_id, image_url, primary_user, partner_user } = data[0];

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

    return (
        <CoupleProvider
            initialCurrentUser={currentUser}
            initialPartner={partner}
            initialCouple={couple}
            isPrimaryUser={isPrimaryUser}
            primaryUserId={primary_user.id}
        >
            <div className="grid grid-rows-[auto_1fr_auto] max-h-screen max-w-[430px] mx-auto relative">
                <main>
                    {children}
                </main>
            </div>

        </CoupleProvider>
    );
}
