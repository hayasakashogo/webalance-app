"use client"
import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { supabase } from "@/utils/supabase/client"
import { redirect, useRouter } from "next/navigation"
import { getCurrentYearMonth } from "@/lib/utils"
import { handleFileUpload } from "@/lib/supabese/client/fetchImg"
import { FaCheck } from "react-icons/fa6"
import Spinner from "@/app/_components/elements/Spinner"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"


const formSchema = z.object({
    couple_id: z
        .string()
        .min(8, { message: "8文字以上で設定してください。" }) // 空文字を防止
        .regex(/^[A-Za-z0-9_]+$/, {
            message: "Couple IDは半角英数字とアンダースコア(_)のみで入力してください。",
        }),
    name: z
        .string()
        .min(1, { message: "名前を入力してください。" })
        .max(8, { message: "名前は8文字以内で入力してください。" }), // 8文字以内に制限
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


type formData = z.infer<typeof formSchema>
type Couple = {
    id: string
    custom_couple_id: string
    primary_user_id: string
    partner_user_id: string | null
}

const checkCoupleDataStatus = async (coupleId: string): Promise<number> => {
    const { data: coupleData, error: selectError } = await supabase
        .from("couples")
        .select("id, custom_couple_id, primary_user_id, partner_user_id")
        .eq("custom_couple_id", coupleId)
        .returns<Couple[]>();

    if (selectError) {
        throw new Error(selectError.message);
    }

    // 0:coupleDataが存在しない
    // 1:存在するが、パートナーが存在しない
    // 2:パートナーも存在する
    if (!coupleData[0]) {
        return 0;
    }
    else if (coupleData[0] && !coupleData[0].partner_user_id) {
        return 1;
    }
    else {
        return 2;
    }
}

const setupPage = () => {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const [email, setEmail] = useState<string | undefined>(undefined);
    const form = useForm<formData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            couple_id: "",
            name: "",
            icon_img: undefined,
        },
        mode: "onChange",
    })

    useEffect(() => {
        const fetchData = async () => {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
            if (sessionError || !sessionData.session) {
                redirect("/error");
            }
            if (sessionData.session) {
                setUserId(sessionData.session.user.id)
                setEmail(sessionData.session.user.email)
            } else {
                redirect('/signin');
            }
        }
        fetchData()
    }, [])

    const onSubmit = async (formData: formData) => {
        try {
            setIsSubmitting(true);
            const { couple_id, name, icon_img } = formData;
            
            // CoupleIDがすでに使用されているかチェック
            const coupleDataState = await checkCoupleDataStatus(couple_id);

            if (coupleDataState === 2) {
                setSubmitError("すでにそのcoupleIDは使用されています。");
                setIsSubmitting(false);
                return;
            }

            // アイコン画像をアップロード
            let filePath: string | undefined = undefined
            if (icon_img && icon_img[0]) {
                const file = icon_img[0] as File
                filePath = await handleFileUpload("user-icons", userId, file);
            }

            // usersテーブルを作成
            const { error: insertError } = await supabase.from("users").insert([
                {
                    id: userId,
                    email: email,
                    name: name,
                    icon_url: filePath || undefined,
                },
            ])
            if (insertError) {
                setSubmitError(insertError.message);
                setIsSubmitting(false);
                return;
            }

            // couplesテーブルを作成、更新
            if (coupleDataState === 0) {
                // couplesに新規追加
                const { error } = await supabase.from("couples").insert([
                    {
                        custom_couple_id: couple_id,
                        primary_user_id: userId,
                    },
                ])
                if (error) {
                    setSubmitError(error.message);
                    setIsSubmitting(false);
                    return
                }
            }
            if (coupleDataState === 1) {
                // partnerにデータを挿入
                const { error } = await supabase
                    .from("couples")
                    .update({ partner_user_id: userId })
                    .eq("custom_couple_id", couple_id)

                if (error) {
                    setSubmitError(error.message);
                    setIsSubmitting(false);
                    return;
                }
            }

            router.push(`/app/${couple_id}/${getCurrentYearMonth()}`)
        } catch (err: any) {
            setSubmitError(`エラー: ${err.message}`);
            setIsSubmitting(false);
            console.error(err)
        }
    }

    return (
        <div
            className="flex flex-col items-center gap-6 w-full max-w-[430px] rounded-2xl py-8 px-4"
            style={{
                boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                border: `1px solid #D9F3F6`
            }}
        >
            <h1 className="font-bold text-2xl">Set up</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col items-center gap-6 w-full"
                >
                    <FormField
                        control={form.control}
                        name="couple_id"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-text font-bold">Couple ID<span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="taro_hanako_1224"
                                        {...field}
                                    />
                                </FormControl>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="justify-start p-0 text-primary text-xs font-bold">Couple IDとは?</AccordionTrigger>
                                        <AccordionContent>
                                            <FormDescription className="text-xs">
                                                パートナーと紐づけるのに使用します。<br />
                                                ・最初に登録する人がIDを作成し、パートナーに共有<br />
                                                ・パートナーは同じIDを入力して登録することで、二人のアカウントが紐づく
                                            </FormDescription>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-text font-bold">表示名<span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="nickname" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="icon_img"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-text font-bold">アイコン</FormLabel>
                                <FormControl>
                                    <Input
                                        className="text-xs"
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
                    <Button className="font-bold" type="submit" disabled={isSubmitting || !form.formState.isValid}>
                        {isSubmitting ? (
                            <Spinner size='12px' />
                        ) : (
                            <FaCheck />
                        )}
                        <span>保存する</span>
                    </Button>
                </form>
            </Form>
            {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
        </div>
    )
}

export default setupPage
