"use client"
import React, { useState } from 'react'
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
import Link from 'next/link'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { getCurrentYearMonth } from '@/lib/utils';
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { PiSignInBold } from 'react-icons/pi'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Spinner from '@/app/_components/elements/Spinner'

type formData = {
    email: string,
    password: string
}

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
});

const SigninPage = () => {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "onChange"
    })

    const onSubmit = async (formData: formData) => {
        try {
            setIsSubmitting(true);
            const { email, password } = formData;

            const { data, error } = await supabase.auth.signInWithPassword({ email, password })

            if (error) {
                if (error.message == 'Email not confirmed') {
                    setSubmitError('メールから本登録を済ませてください。メールが届いていない場合はもう一度サインアップをお試しください。');
                    setIsSubmitting(false);
                } else if (error.message == 'Invalid login credentials') {
                    setSubmitError('メールアドレスまたはパスワードに誤りがあります。');
                    setIsSubmitting(false);
                } else {
                    throw new Error();
                }
                return;
            }
            const { data: coupleData, error: fetchError } = await supabase
                .from('couples')
                .select('id,custom_couple_id,image_url,primary_user:primary_user_id(id,name,icon_url), partner_user:partner_user_id(id,name,icon_url)')
                .or(`primary_user_id.eq.${data.user.id},partner_user_id.eq.${data.user.id}`)
                .returns<CoupleData[]>();

            if (fetchError) {
                setSubmitError(fetchError.message);
                setIsSubmitting(false);
                return;
            }

            if (coupleData && coupleData.length > 0) {
                router.push(`/app/${coupleData[0].custom_couple_id}/${getCurrentYearMonth()}`);
            } else {
                router.push('/setup');
            }
        } catch (err) {
            setSubmitError('予期せぬエラーが発生しました。時間を空けてもう一度お試しください。');
            setIsSubmitting(false);
            console.error(err)
            return;
        }
    }

    return (
        <div
            className='flex flex-col items-center gap-6 w-full max-w-[430px] border rounded-2xl py-8 px-4'
            style={{
                boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                border: `1px solid #D9F3F6`
            }}
        >
            <h1 className='font-bold text-2xl text-text'>Sign in</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col items-center gap-6 w-full">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel className='font-bold text-text flex items-center gap-1'>
                                    <MdOutlineMailOutline size={"16px"} />
                                    メールアドレス
                                </FormLabel>
                                <FormControl>
                                    <Input type='email' placeholder="webalance@sample.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel className='font-bold text-text flex items-center gap-1'>
                                    <RiLockPasswordLine size={"16px"} />
                                    パスワード
                                </FormLabel>
                                <FormControl>
                                    <div className='relative w-full'>
                                        <Input type={showPassword ? 'text' : 'password'} placeholder="********" {...field} />
                                        <button type='button' className='absolute right-3 top-1/2 transform -translate-y-1/2' onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    <Link href={"/reset_password"} className='text-primary text-xs block text-right'>パスワードをお忘れですか？</Link>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="font-bold" type="submit" disabled={isSubmitting || !form.formState.isValid}>
                        {isSubmitting ? <Spinner size='12px' /> : <PiSignInBold size="20px" />}
                        <span>Sign in</span>
                    </Button>
                </form>
            </Form>
            <Link href={"/signup"} className='text-primary font-bold text-xs'>Sign up はこちら</Link>
            {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
        </div>
    )
}

export default SigninPage
