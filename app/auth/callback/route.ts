import { NextRequest, NextResponse } from "next/server";

// 認証メールのリンク押下時の処理、自動サインインをやめてリダイレクト
export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);

    try {
        const code = requestUrl.searchParams.get('code');

        if (!code) {
            return NextResponse.redirect(`${requestUrl.origin}/error/expired`);
        }

        return NextResponse.redirect(`${requestUrl.origin}/signin?verified=1`);

    } catch (err) {
        console.error("認証処理中に予期しないエラー:", err);
        return NextResponse.redirect(`${requestUrl.origin}/error`);
    }
}
