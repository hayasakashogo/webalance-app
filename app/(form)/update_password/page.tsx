"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
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
import { supabase } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/app/_components/elements/Spinner";
import Link from "next/link";
import toast from "react-hot-toast";
import { signOut } from "@/lib/supabese/client/signout";
import { FaCheck } from "react-icons/fa";

const formSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: "パスワードは8文字以上で入力してください" })
            .regex(/^[A-Za-z0-9]+$/, {
                message: "パスワードは半角英数字のみで入力してください",
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "パスワードが一致しません",
        path: ["confirmPassword"],
    });

const UpdatePasswordPage = () => {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (data: { password: string }) => {
        if (!code) return;

        try {
            setIsSubmitting(true);
            setSubmitError(null);

            const { error } = await supabase.auth.updateUser({
                password: data.password,
            });

            if (error) {
                setSubmitError("パスワードの更新に失敗しました。");
                setIsSubmitting(false);
                return;
            }

            await signOut("パスワードが更新されました。サインインしてください。")
            router.push("/signin");

        } catch (err) {
            setSubmitError("予期せぬエラーが発生しました。時間を空けて再度お試しください。");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (code) {
        return (
            <div
                className="flex flex-col items-center gap-6 w-full max-w-[430px] border rounded-2xl py-8 px-4 box-border"
                style={{
                    boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                    border: `1px solid #D9F3F6`,
                }}
            >
                <h1 className="font-bold text-2xl text-text">新しいパスワードを設定</h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col items-center gap-6 w-full"
                    >
                        {/* パスワード入力欄 */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="font-bold text-text">新しいパスワード</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2 text-gray-500"
                                        >
                                            {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                                        </button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 確認用パスワード入力欄 */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="font-bold text-text">パスワード確認</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-2 text-gray-500"
                                        >
                                            {showConfirmPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                                        </button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className="font-bold" type="submit" disabled={isSubmitting || !form.formState.isValid}>
                            {isSubmitting ? <Spinner size='12px' /> : <FaCheck size="20px" />}
                            <span>更新</span>
                        </Button>
                    </form>
                </Form>
                {submitError && <p className="text-red-500">{submitError}</p>}
            </div>
        );
    } else {
        return (
            <div className="flex flex-col items-center gap-4">
                <p className="text-center text-gray-700">このリセットリンクは無効または期限切れです。</p>
                <Link href={"/reset_password"} className="font-bold text-primary">
                    新しいリセットメールを送信する
                </Link>
            </div>
        )
    }
};

export default UpdatePasswordPage;
