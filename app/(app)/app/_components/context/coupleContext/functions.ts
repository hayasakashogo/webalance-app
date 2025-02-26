import { getSignedUrl } from "@/lib/supabese/client/fetchImg";
import { Couple, RawCouple, RawUser, User } from "./types";

export const getFormattedUserData = async (userData: RawUser): Promise<User> => {
    console.log(userData)
    const icon = await getSignedUrl('user-icons', userData.icon_url);
    const formattedUserData: User = {
        id: userData.id,
        name: userData.name,
        icon: icon
    }
    return formattedUserData;
};
export const getFormattedCoupleData = async (coupleData: RawCouple): Promise<Couple> => {
    console.log(coupleData)

    const headerImg = await getSignedUrl('couple-images', coupleData.image_url);
    const formattedUserData: Couple = {
        id: coupleData.id,
        coupleId: coupleData.custom_couple_id,
        headerImg: headerImg
    }
    return formattedUserData;
};