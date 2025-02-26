'use client'
import Link from 'next/link'
import React from 'react'

const signupConfPage = () => {
    return (

        <div className='w-11/12 space-y-4 flex flex-col items-center'>
            <h1 className='text-xl font-bold'>本登録メールを送信しました。</h1>
            <p className='text-xs'>
                <b>メール内のリンクをクリックして本登録を完了してください。</b><br />
                もし、メールが届かない場合は、迷惑メールフォルダをご確認いただくか、<br />
                再度メールアドレスを確認の上、サインアップしてください。
            </p>
            <Link href={"/signup"} className='block text-center text-primary font-bold'>Sign upページへ</Link>
        </div>
    )
}

export default signupConfPage
