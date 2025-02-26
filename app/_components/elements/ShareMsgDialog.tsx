"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { colors } from "@/lib/colors/colors";
import { LuCopy } from "react-icons/lu";
import toast from "react-hot-toast";

type ShareMsgDialogProps = {
    coupleId: string;
};

const ShareMsgDialog = ({ coupleId }: ShareMsgDialogProps) => {
    const dialogCookieKey = "dialog_checked";
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        const cookieExists = Cookies.get(dialogCookieKey);
        if (!cookieExists) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        // Cookie の有効期限を決定（チェックあり: 7日, チェックなし: 1日）
        const expires = dontShowAgain ? 7 : 1;
        Cookies.set(dialogCookieKey, "true", { expires });
        setIsOpen(false);
    };

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

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="w-[90%] max-w-[430px] rounded-md">
                <DialogHeader>
                    <DialogTitle className="text-md">パートナーに<br/>Couple IDを共有してください</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-4 justify-center mt-4">
                    <p className='text-text font-bold text-center border border-primary bg-base px-8 py-1 rounded-sm'>{coupleId}</p>
                    <button onClick={() => handleCopy(coupleId)}>
                        <LuCopy color={colors.primary} size={"24px"} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="dontShowAgain"
                        checked={dontShowAgain}
                        onChange={() => setDontShowAgain(!dontShowAgain)}
                    />
                    <label htmlFor="dontShowAgain" className="text-sm">
                        次回以降表示しない
                    </label>
                </div>

                <DialogFooter className="mt-4 flex-none">
                    <div className="flex items-center justify-around">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="text-primary font-bold"
                                onClick={handleClose}
                            >
                                閉じる
                            </button>
                        </DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ShareMsgDialog;
