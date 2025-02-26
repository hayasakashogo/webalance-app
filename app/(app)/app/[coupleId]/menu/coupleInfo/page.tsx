'use client'

import { useCoupleContext } from "../../../_components/context/coupleContext/CoupleContext";
import { colors } from "@/lib/colors/colors";
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
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { handleFileUpload } from "@/lib/supabese/client/fetchImg";
import { supabase } from "@/utils/supabase/client";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Spinner from "@/app/_components/elements/Spinner";
import { LuCopy } from "react-icons/lu";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog";

const formSchemaUpload = z.object({
    headerImg: z
        .custom<FileList | undefined>(() => true) // 型を明示的に FileList にする
        .optional()
        .refine(
            (file) => {
                if (!file || file.length === 0) return true; // ファイルがない場合はチェックしない
                return ["image/jpeg", "image/png"].includes(file[0].type);
            },
            { message: "画像はJPGまたはPNG形式のみ対応しています。" }
        ),
});

type formDataUpload = z.infer<typeof formSchemaUpload>

export default function CoupleInfoPage() {
    const { currentUser, couple, isPrimaryUser } = useCoupleContext();
    const [isHeaderImgEdit, setIsHeaderImgEdit] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const router = useRouter();

    const formUpload = useForm<formDataUpload>({
        resolver: zodResolver(formSchemaUpload),
        defaultValues: {
            headerImg: undefined,
        },
        mode: "onChange",
    });

    const uploadImage = async (formData: formDataUpload) => {
        try {
            const { headerImg } = formData;
            console.log(headerImg)

            if (!headerImg) {
                setIsHeaderImgEdit(false);
                return;
            }

            // アイコン画像をアップロード
            let filePath: string | undefined = undefined
            if (headerImg && headerImg[0]) {
                const file = headerImg[0] as File
                filePath = await handleFileUpload("couple-images", couple.id, file);
            }

            // couplesテーブルを更新
            const { error } = await supabase
                .from("couples")
                .update({ image_url: filePath || undefined })
                .eq("id", couple.id);

            if (error) {
                setUploadError(error.message)
                return;
            }
            formData.headerImg = undefined;
            setIsHeaderImgEdit(false);

        } catch (err) {
            setUploadError('予期せぬエラーが発生しました');
            console.error(err)
        }
    }

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text); // クリップボードにコピー
            toast.success('Couple IDをコピーしました。',
                {
                    duration: 3000,
                }
            );
        } catch (err) {
            toast.error('予期せぬエラーが発生しました。',
                {
                    duration: 3000,
                    style: {
                        backgroundColor: colors.error_light,
                        color: colors.error,
                    },
                }
            );
            console.error(err)
        }
    }

    const deleteUser = async () => {
        try {
            const { error } = await supabase
                .from("users")
                .delete()
                .eq("id", currentUser.id);
            
            if (error) {
                toast.error("予期せぬエラーが発生しました。",
                    {
                        duration: 3000,
                        style: {
                            backgroundColor: colors.error_light,
                            color: colors.error,
                        },
                    }
                );
                return;
            }
            
            toast.success("Couple IDを解除しました。",
                {
                    duration: 3000,
                }
            );
            router.refresh();

        } catch (err) {
            toast.error("予期せぬエラーが発生しました。",
                {
                    duration: 3000,
                    style: {
                        backgroundColor: colors.error_light,
                        color: colors.error,
                    },
                }
            );
            console.error(err);
            return;
        }

    }

    return (
        <div>
            <header
                className="flex justify-between items-center p-3 bg-primary text-white"
            >
                <button
                    className="-mr-[24px] relative z-10"
                    onClick={() => {
                        router.refresh();
                        router.back();
                    }}
                >
                    <IoIosArrowBack size={"24px"} />
                </button>
                <h1 className="w-full text-center font-bold">Couple Info</h1>
            </header>
            <div className="flex flex-col">
                <div className="flex flex-col items-center gap-5">

                    <div className="w-full">
                        <div className='w-full relative'>
                            <div className='absolute z-20 w-full h-full flex items-center px-2'>
                                <p className='text-center font-bold text-lg text-white w-full' style={{
                                    textShadow: '2px 2px 4px rgba(255, 255, 255, 0.6)',
                                }}>{couple.coupleId}</p>
                            </div>
                            <div>
                                <AspectRatio ratio={5 / 1} className='border relative before:content-[""] before:absolute before:w-full before:h-full before:bg-black before:bg-opacity-30 before:z-10'>
                                    <Image src={couple.headerImg ? couple.headerImg : "/sample1.jpg"} fill alt="Image" className="object-cover" />
                                </AspectRatio>
                            </div>
                        </div>
                    </div>
                    {isHeaderImgEdit ?
                        <Form {...formUpload}>
                            <form
                                onSubmit={formUpload.handleSubmit(uploadImage)}
                                className="flex flex-col items-center gap-6 w-4/5"
                            >
                                <FormField
                                    control={formUpload.control}
                                    name="headerImg"
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
                                        onClick={() => setIsHeaderImgEdit(false)}
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
                            onClick={() => setIsHeaderImgEdit(true)}
                        >
                            {couple.headerImg ?
                                "ヘッダー画像を変更する"
                                :
                                "ヘッダー画像を設定する"
                            }
                            <FaEdit size={"12px"} />
                        </button>
                    }
                </div>

                <div className="flex justify-center my-6 border-b mx-6 pb-2">
                    <p className="font-bold text-gray-600">Couple ID<span className="mx-4">：</span></p>
                    <div className="flex items-center gap-4 min-w-[200px] justify-between">
                        <p className='text-text font-bold text-center'>{couple.coupleId}</p>
                        <button onClick={() => handleCopy(couple.coupleId)}>
                            <LuCopy color={colors.primary} size={"24px"} />
                        </button>
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <button className="mx-auto">
                            <span className="text-red-500">Couple IDを解除</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="w-[90%] max-w-[430px] rounded-sm">
                        <DialogHeader>
                            <DialogTitle>Couple IDを解除しますか？</DialogTitle>
                            <DialogDescription>
                                以下の注意点をご確認ください。
                            </DialogDescription>
                        </DialogHeader>
                        <div className="">
                            <ul className="list-disc list-outside ml-4 text-text space-y-2">
                                <li className="text-[14px]">表示名、アイコン画像もリセットされます。</li>
                                <li className="text-[14px]">リセットされた情報は、再度、セットアップページから設定してください。</li>
                                {isPrimaryUser &&
                                    <li className="text-[14px]">パートナーがいる場合、パートナーも強制的に登録情報がリセットされます。</li>
                                }
                            </ul>

                        </div>
                        <DialogFooter className="mt-4 flex-none">
                            <div className="flex items-center justify-around">
                                <DialogClose asChild>
                                    <button
                                        type="button"
                                        className=" text-red-500 font-bold"
                                    >
                                        キャンセル
                                    </button>
                                </DialogClose>
                                <button
                                    className="bg-red-500 py-1 px-4 rounded-sm text-base font-bold "
                                    onClick={() => deleteUser()}
                                >
                                    解除する
                                </button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}