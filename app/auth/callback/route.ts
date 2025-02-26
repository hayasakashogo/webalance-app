import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// 認証メールのリンク押下時の処理、自動サインインをやめてリダイレクト
export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);

    try {
        const code = requestUrl.searchParams.get('code');

        if (!code) {
            console.error("認証コードがURLに含まれていません。");
            return NextResponse.redirect(`${requestUrl.origin}/error/expired`);
        }

        // Supabaseクライアント作成
        const supabase = await createClient();

        // 認証コードを使用してセッションを取得
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error("サインイン処理に失敗:", error.message);
            return NextResponse.redirect(`${requestUrl.origin}/signin?error=signin_failed`);
        }

        // サインイン成功 → セットアップ画面へ
        return NextResponse.redirect(`${requestUrl.origin}/setup`);
    } catch (err) {
        console.error("認証処理中に予期しないエラー:", err);
        return NextResponse.redirect(`${requestUrl.origin}/error`);
    }
}
