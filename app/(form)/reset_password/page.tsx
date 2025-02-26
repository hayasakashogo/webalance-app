"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { MdOutlineMailOutline } from "react-icons/md";
import Spinner from "@/app/_components/elements/Spinner";
import { LuSendHorizontal } from "react-icons/lu";
import toast from "react-hot-toast";

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "メールアドレスを入力してください" })
        .email({ message: "有効なメールアドレスを入力してください" }),
});

const ResetPasswordPage = () => {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (data: { email: string }) => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);

            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/update_password`,
            });

            if (error) {
                setSubmitError("パスワードリセットメールの送信に失敗しました。");
                setIsSubmitting(false);
                return;
            }

            toast.success(
                "パスワードリセットのメールを送信しました。",
                {
                    duration: 4000,
                }
            );
            setIsSubmitting(false);
            form.reset();
        } catch (err) {
            setSubmitError("予期せぬエラーが発生しました。時間を空けて再度お試しください。");
            setIsSubmitting(false);
            console.error(err);
        }
    };

    return (
        <div
            className="flex flex-col items-center gap-6 w-full max-w-[430px] border rounded-2xl py-8 px-4"
            style={{
                boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                border: `1px solid #D9F3F6`,
            }}
        >
            <div>
                <h1 className="font-bold text-2xl text-text text-center">パスワードリセット</h1>
                <p className="text-gray-400 text-xs mt-2">パスワード再設定用のリンクをメールにお送りします。</p>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col items-center gap-6 w-full"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="font-bold text-text flex items-center gap-1">
                                    <MdOutlineMailOutline size={"16px"} />
                                    メールアドレス
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="webalance@sample.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="font-bold" type="submit" disabled={isSubmitting || !form.formState.isValid}>
                        {isSubmitting ? <Spinner size='12px' /> : <LuSendHorizontal size="20px" />}
                        <span>送信</span>
                    </Button>
                </form>
            </Form>
            {submitError && <p className="text-red-500">{submitError}</p>}
            <Link href={"/signin"} className="text-primary font-bold text-xs">
                Sign in へ戻る
            </Link>
        </div>
    );
};

export default ResetPasswordPage;
