'use client'

import { useCoupleContext } from "../../../_components/context/coupleContext/CoupleContext";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { HiUser } from "react-icons/hi";
import { colors } from "@/lib/colors/colors";
import { Avatar } from "@/components/ui/avatar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleFileUpload } from "@/lib/supabese/client/fetchImg";
import { supabase } from "@/utils/supabase/client";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import Spinner from "@/app/_components/elements/Spinner";

const formSchemaUpload = z.object({
    icon_img: z
        .custom<FileList | undefined>((file) => true) // 型を明示的に FileList にする
        .optional()
        .refine(
            (file) => {
                if (!file || file.length === 0) return true; // ファイルがない場合はチェックしない
                return ["image/jpeg", "image/png"].includes(file[0].type);
            },
            { message: "画像はJPGまたはPNG形式のみ対応しています。" }
        ),
});

const formSchemaNameEdit = z.object({
    name: z
        .string()
        .min(1, { message: "名前を入力してください。" })
        .max(8, { message: "名前は8文字以内で入力してください。" }),
});


type formDataUpload = z.infer<typeof formSchemaUpload>
type formDataNameEdit = z.infer<typeof formSchemaNameEdit>

export default function ProfilePage() {
    const { currentUser, isPrimaryUser } = useCoupleContext();
    const [isIconEdit, setIsIconEdit] = useState<boolean>(false);
    const [isNameEdit, setIsNameEdit] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [nameEditError, setNameEditError] = useState<string | null>(null);
    const router = useRouter();

    const formUpload = useForm<formDataUpload>({
        resolver: zodResolver(formSchemaUpload),
        defaultValues: {
            icon_img: undefined,
        },
        mode: "onChange",
    });
    const formNameEdit = useForm<formDataNameEdit>({
        resolver: zodResolver(formSchemaNameEdit),
        defaultValues: {
            name: currentUser.name,
        },
        mode: "onChange",
    });

    const uploadImage = async (formData: formDataUpload) => {
        try {
            const { icon_img } = formData;

            if (!icon_img) {
                setIsIconEdit(false);
                return;
            }

            // アイコン画像をアップロード
            let filePath: string | undefined = undefined
            if (icon_img && icon_img[0]) {
                const file = icon_img[0] as File
                filePath = await handleFileUpload("user-icons", currentUser.id, file);
            }

            // usersテーブルを更新
            const { error } = await supabase
                .from("users")
                .update({ icon_url: filePath || undefined })
                .eq("id", currentUser.id);

            if (error) {
                setUploadError(error.message)
                return;
            }
            setIsIconEdit(false);

        } catch (err: any) {
            setUploadError(`エラー: ${err.message}`)
            console.error(err)
        }
    }
    const nameEdit = async (formData: formDataNameEdit) => {
        try {
            const { name } = formData;

            // usersテーブルを更新
            const { error } = await supabase
                .from("users")
                .update({ name: name })
                .eq("id", currentUser.id);

            if (error) {
                setNameEditError(error.message)
                return;
            }
            setIsNameEdit(false);

        } catch (err: any) {
            setNameEditError(`エラー: ${err.message}`)
            console.error(err)
        }
    }
    return (
        <>
            <header className="flex justify-between items-center p-3 text-white bg-primary">
                <button
                    className="-mr-[24px] relative z-10"
                    onClick={() => {
                        router.refresh();
                        router.back();
                    }}>
                    <IoIosArrowBack size={"24px"} />
                </button>
                <h1 className="w-full text-center font-bold">Profile</h1>
            </header>
            <div className="flex flex-col items-center gap-5 mt-8">
                <Avatar
                    className='bg-white border-4 border-primary w-[120px] h-[120px]'
                    style={{ border: isPrimaryUser ? `solid 1px ${colors.primary}` : `solid 1px ${colors.secondary}` }}
                >
                    <AvatarImage src={currentUser.icon} />
                    <AvatarFallback className="w-full flex items-center justify-center" style={{ backgroundColor: isPrimaryUser ? colors.primary_light : colors.secondary_light }}>
                        <HiUser color={isPrimaryUser ? colors.primary : colors.secondary} size={"100px"} />
                    </AvatarFallback>
                </Avatar>
                {isIconEdit ?
                    <Form {...formUpload}>
                        <form
                            onSubmit={formUpload.handleSubmit(uploadImage)}
                            className="flex flex-col items-center gap-6 w-4/5"
                        >
                            <FormField
                                control={formUpload.control}
                                name="icon_img"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        {/* <FormLabel className="text-text font-bold">User Icon</FormLabel> */}
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/jpeg, image/png"
                                                onChange={(e) => {
                                                    const files = e.target.files;
                                                    field.onChange(files && files.length > 0 ? files : undefined);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            JPG、PNG形式の画像のみアップロードできます。
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    className="text-xs bg-base py-1 px-2 rounded-md text-primary font-bold border border-primary"
                                    onClick={() => setIsIconEdit(false)}
                                >
                                    キャンセル
                                </button>
                                <button
                                    className="text-xs bg-primary py-1 px-2 rounded-md text-base font-bold flex items-center gap-1"
                                    type="submit"
                                    disabled={formUpload.formState.isSubmitting || !formUpload.formState.isValid}
                                    style={{ opacity: formUpload.formState.isSubmitting || !formUpload.formState.isValid ? 0.5 : 1 }}
                                >
                                    {formUpload.formState.isSubmitting ? (
                                        <Spinner size='12px' />
                                    ) : (
                                        <FaCheck />
                                    )}
                                    <span>保存する</span>
                                </button>
                            </div>
                            {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
                        </form>
                    </Form>
                    :
                    <button
                        className="text-primary font-bold flex items-center gap-2 text-xs"
                        onClick={() => {
                            setIsIconEdit(true)
                            if (isNameEdit) {
                                setIsNameEdit(false);
                            }
                        }
                        }>
                        {currentUser.icon ?
                            "アイコンを変更する"
                            :
                            "アイコンを設定する"
                        }
                        <FaEdit size={"12px"} />
                    </button>
                }
            </div>

            <div className="flex justify-center mt-6 border-b mx-6 pb-2">
                <p className="font-bold text-gray-600">表示名<span className="mx-4">：</span></p>
                {isNameEdit ?
                    <Form {...formNameEdit}>
                        <form onSubmit={formNameEdit.handleSubmit(nameEdit)}>
                            <FormField
                                control={formNameEdit.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input className="max-w-[200px] max-h-[24px]" type="text" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <button
                                    type="button"
                                    className="text-xs bg-base py-1 px-2 rounded-md text-primary font-bold border border-primary"
                                    onClick={() => setIsNameEdit(false)}
                                >
                                    キャンセル
                                </button>
                                <button
                                    className="text-xs bg-primary py-1 px-2 rounded-md text-base font-bold flex items-center gap-1"
                                    type="submit"
                                    disabled={formNameEdit.formState.isSubmitting || !formNameEdit.formState.isValid}
                                    style={{ opacity: formNameEdit.formState.isSubmitting || !formNameEdit.formState.isValid ? 0.5 : 1 }}
                                >
                                    {formNameEdit.formState.isSubmitting ? (
                                        <Spinner size='12px' />
                                    ) : (
                                        <FaCheck />
                                    )}
                                    <span>保存する</span>
                                </button>
                            </div>
                            {nameEditError && <p className="text-red-500 mt-2">{nameEditError}</p>}
                        </form>
                    </Form>
                    :
                    <div className="flex items-center gap-4 min-w-[200px] justify-between">
                        <p className='text-text font-bold text-center'>{currentUser.name}</p>
                        <button onClick={() => {
                            setIsNameEdit(true);
                            if (isIconEdit) {
                                setIsIconEdit(false);
                            }
                        }}>
                            <FaEdit color={colors.primary} size={"20px"} />
                        </button>
                    </div>
                }

            </div>
        </>
    )
}