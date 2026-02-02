import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getSignedUrl } from "@/lib/supabese/server/getImgUrl";
import { CoupleProvider } from "../_components/context/coupleContext/CoupleContext";
import Header from "../_components/layout/header/Header";
import { CoupleData, CoupleLayoutProps, FormattedUserData } from "./types";
import { TransitionProvider } from "../_components/context/transitionProvider/TransitionProvider";
import { DirectionProvider } from "../_components/context/directionContext/DirectionContext";

export default async function CoupleLayout({ children, params }: CoupleLayoutProps) {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/");
    }

    const paramsData = await params;
    const { coupleId } = paramsData;

    const { data: coupleData, error: coupleError } = await supabase
        .from("couples")
        .select(`id,custom_couple_id,image_url,primary_user:primary_user_id(id,name,icon_url),partner_user:partner_user_id(id,name,icon_url)`)
        .or(`primary_user_id.eq.${user.id},partner_user_id.eq.${user.id}`)
        .single<CoupleData>();

    if (coupleError || !coupleData) {
        redirect("/setup");
    }

    if (coupleData.custom_couple_id !== coupleId) {
        notFound();
    }


    const [primaryIcon, partnerIcon, headerImg] = await Promise.all([
        getSignedUrl("user-icons", coupleData.primary_user.icon_url),
        getSignedUrl("user-icons", coupleData.partner_user?.icon_url),
        getSignedUrl("couple-images", coupleData.image_url),
    ]);

    const isPrimaryUser = user.id === coupleData.primary_user.id;

    const currentUser: FormattedUserData = {
        id: isPrimaryUser
            ? coupleData.primary_user.id
            : coupleData.partner_user!.id,
        name: isPrimaryUser
            ? coupleData.primary_user.name
            : coupleData.partner_user!.name,
        icon: isPrimaryUser ? primaryIcon : partnerIcon,
    };

    const partner: FormattedUserData | null =
        coupleData.partner_user && {
            id: isPrimaryUser
                ? coupleData.partner_user.id
                : coupleData.primary_user.id,
            name: isPrimaryUser
                ? coupleData.partner_user.name
                : coupleData.primary_user.name,
            icon: isPrimaryUser ? partnerIcon : primaryIcon,
        };

    const couple = {
        id: coupleData.id,
        coupleId: coupleData.custom_couple_id,
        headerImg,
    };

    return (
        <CoupleProvider
            initialCurrentUser={currentUser}
            initialPartner={partner}
            initialCouple={couple}
            isPrimaryUser={isPrimaryUser}
            primaryUserId={coupleData.primary_user.id}
        >
            <TransitionProvider>
                <DirectionProvider>
                    <div className="grid grid-rows-[auto_1fr_auto] max-h-screen max-w-[430px] mx-auto">
                        <Header />
                        <main className="pb-[75px]">{children}</main>
                    </div>
                </DirectionProvider>
            </TransitionProvider>
        </CoupleProvider>
    );
}
