"use server";

import { createClient } from "@/utils/supabase/server";
import { Session, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

type GetSessionResponse = {
    session: Session | null;
    error: Error | null;
};


type GetUserResponse = {
    user: User | null; // `User` 型は Supabase の型定義に基づきます
    error: Error | null;
};

export async function getUser(): Promise<GetUserResponse> {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error) {
        return { user: null, error: new Error(error.message) };
    }

    return { user: data.user, error: null };
}


export async function getSession(): Promise<GetSessionResponse> {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getSession();

    if (error) {
        return { session: null, error: new Error(error.message) };
    }

    return { session: data.session, error: null };
}

export async function signOut(): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Sign-out error:", error.message);
        redirect("/error?message=" + encodeURIComponent(error.message));
    }
    redirect('/');
}

// export async function signOut(): Promise<void> {
//     try {
//         const supabase = await createClient();
//         const { error } = await supabase.auth.signOut();

//         if (error) {
//             console.error("Sign-out error:", error.message);
//             redirect("/error?message=" + encodeURIComponent(error.message));
//         }

//         // redirect("/");
//     } catch (err) {
//         console.error("Unexpected error during sign-out:", err);
//         redirect("/error?message=" + encodeURIComponent("予期せぬエラーが発生しました。"));
//     }
// }