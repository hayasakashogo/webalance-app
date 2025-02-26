import { supabase } from "@/utils/supabase/client";
import toast from "react-hot-toast";

export const signOut = async (msg: string | null) => {
    await supabase.auth.signOut();
    if(msg){
        toast.success(
            msg,
            {
                duration: 3000,
            }
        );
    }
}