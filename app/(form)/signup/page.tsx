"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { MdOutlineMailOutline } from 'react-icons/md'
import { RiLockPasswordLine } from 'react-icons/ri'
import { PiSignInBold } from "react-icons/pi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Spinner from '../../_components/elements/Spinner'

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "メールアドレスを入力してください" })
        .email({ message: "有効なメールアドレスを入力してください" }),
    password: z
        .string()
        .min(8, { message: "パスワードは8文字以上で入力してください" })
        .regex(/^[A-Za-z0-9]+$/, {
            message: "パスワードは半角英数字のみで入力してください",
        }),
    confirmPassword: z
        .string()
        .min(8, { message: "パスワード確認を入力してください" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const SignupPage = () => {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        mode: "onChange"
    });

    const onSubmit = async (formData: FormData) => {
        try {
            setIsSubmitting(true);
            const { email, password } = formData;

            const { data, error } = await supabase
                .from('users')
                .select('email')
                .eq('email', email);

            if (error) {
                throw new Error(error.message);
            }

            if (data.length > 0) {
                setSubmitError('すでに登録済みのメールアドレスです。');
                setIsSubmitting(false);
                return;
            }

            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            });
            if (authError) {
                setSubmitError(`サインアップに失敗しました。：${authError.message}`);
                setIsSubmitting(false);
                return;
            }

            router.push(`/signup/conf`);
        } catch (err) {
            setSubmitError('予期せぬエラーが発生しました。時間を空けてもう一度お試しください。');
            setIsSubmitting(false);
            console.error(err);
        }
    };

    return (
        <div
            className='mx-auto flex flex-col items-center gap-6 w-full max-w-[430px] rounded-2xl py-8 px-4'
            style={{
                boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                border: `1px solid #D9F3F6`
            }}
        >
            <h1 className='font-bold text-2xl'>Sign up</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-6 w-full">
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel className='font-bold text-text flex items-center gap-1'>
                                <MdOutlineMailOutline size="16px" /> メールアドレス
                            </FormLabel>
                            <FormControl>
                                <Input type='email' placeholder="webalance@sample.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel className='font-bold text-text flex items-center gap-1'>
                                <RiLockPasswordLine size="16px" /> パスワード
                            </FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Input type={showPassword ? 'text' : 'password'} placeholder="********" {...field} />
                                    <button type="button" className='absolute right-2 top-2' onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <AiOutlineEyeInvisible size="20px" /> : <AiOutlineEye size="20px" />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel className='font-bold text-text flex items-center gap-1'>
                                <RiLockPasswordLine size="16px" /> パスワード確認
                            </FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="********" {...field} />
                                    <button type="button" className='absolute right-2 top-2' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <AiOutlineEyeInvisible size="20px" /> : <AiOutlineEye size="20px" />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>{isSubmitting ? <Spinner size='12px' /> : <PiSignInBold size="20px" />} <span>Sign up</span></Button>
                </form>
            </Form>
            <Link href="/signin" className='text-primary font-bold text-xs'>Sign in はこちら</Link>
            {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
        </div>
    );
}
export default SignupPage;
