import { supabase } from "@/utils/supabase/client";

export const getSignedUrl = async (bucket: string, filePath: string | undefined, expiresIn: number = 60): Promise<string | undefined> => {
    if (!filePath) {
        return undefined;
    }
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn)

    if (error) {
        console.log('Error creating signed URL:', error)
        return undefined
    }

    return data.signedUrl;
}

// 画像アップロード
export const handleFileUpload = async (bucket: string, id: string | undefined, file: File): Promise<string | undefined> => {
    if (!id) {
        return undefined;
    }
    const fileExtension = file.name.split(".").pop()
    const filePath = `${id}/image.${fileExtension}`

    // 既存のファイルを削除
    const { data: existingFile, error: fetchError } = await supabase.storage
        .from(bucket)
        .list(id, { limit: 1, search: 'image.' })


    if (fetchError) {
        throw new Error(`ファイル取得エラー: ${fetchError.message}`)
    }

    if (existingFile && existingFile.length > 0) {
        await supabase.storage.from(bucket).remove([`${id}/${existingFile[0].name}`]);
    }

    // 新しいファイルをアップロード
    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true })

    if (uploadError) {
        throw new Error(`アップロードエラー: ${uploadError.message}`)
    }

    return filePath;
}
