import { createClient } from "@/utils/supabase/server";
import { cache } from "react"; // Next.js のキャッシュ

// キャッシュの有無を判別するためのフラグを返す関数
export const getSignedUrl = cache(async (bucket: string, filePath: string | undefined, expiresIn: number = 600): Promise<string | undefined> => {
    if (!filePath) {
        return undefined;
    }
    
    console.log("Fetching signed URL from Supabase");

    const supabase = await createClient();
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

    if (error) {
        console.error("Error creating signed URL:", error);
        return undefined;
    }

    // ここでキャッシュにデータを保存する
    const cachedSignedUrl = data.signedUrl;

    // 追加: フェッチした場合のログを出力
    console.log("New signed URL fetched:", cachedSignedUrl);

    return cachedSignedUrl;
});

