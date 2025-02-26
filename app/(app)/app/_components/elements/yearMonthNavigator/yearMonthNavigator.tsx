import { colors } from "@/lib/colors/colors";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { format } from "date-fns";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { DateScrollPicker } from "../DateScrollPicker";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
// import { formatDate } from "date-fns";

function getAdjacentMonths(year: number, month: number): { prev: string; next: string | null; } {

    // 現在の年月を基準にDateオブジェクトを生成
    const currentDate = new Date(year, month - 1); // 月は0始まりなので-1

    // 前の月
    const prevDate = new Date(currentDate);
    prevDate.setMonth(currentDate.getMonth() - 1);

    // 次の月
    const nextDate = new Date(currentDate);
    nextDate.setMonth(currentDate.getMonth() + 1);

    // フォーマットを戻す
    const formatDate = (date: Date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    const nextMonth =
        nextDate.getFullYear() > currentDate.getFullYear() ||
            (nextDate.getFullYear() === currentDate.getFullYear() && nextDate.getMonth() >= currentDate.getMonth())
            ? formatDate(nextDate)
            : null;

    return {
        prev: formatDate(prevDate),
        next: nextMonth,
    };
}

const yearMonthToString = (date: Date): string => {
    return format(date, "yyyy-MM");
}

export default function YearMonthNavigator() {
    const { yearMonth } = useParams<Params>();
    const [year, month] = yearMonth.split("-").map(Number);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(yearMonth + '-01'));
    const [path, setPath] = useState<string>(yearMonthToString(selectedDate));
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);


    useEffect(() => {
        setPath(yearMonthToString(selectedDate));
    }, [selectedDate]);

    // 日付が変更された時のハンドラ
    const handleDateChange = (newValue: Date) => {
        setSelectedDate(newValue);
    };
    const { prev, next } = getAdjacentMonths(year, month);

    return (
        <div
            className="sticky bg-base z-10 py-4 rounded-b-2xl top-0 flex items-center justify-around"
            style={{
                boxShadow: '0px 10px 12px -10px #777777',
            }}
        >
            <Link
                href={`${prev}`}
                className="bg-primary rounded-full"
                style={{
                    boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                    border: `1px solid #D9F3F6`
                }}
            >
                <IoIosArrowDropleftCircle size={'32px'} color={colors.base} />
            </Link>

            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger>
                    <div
                        className="font-bold text-xl bg-base px-5 py-2 rounded-full flex items-center gap-4 cursor-pointer text-text"
                        style={{
                            boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                            border: `1px solid #D9F3F6`
                        }}
                    >
                        {year}年 {month}月
                        <IoIosArrowDown size={'24px'} color={colors.text} />

                    </div>
                </DrawerTrigger>
                <DrawerContent className='bg-base'>
                    <div className="flex justify-between px-6 -mt-2">
                        <button onClick={() => setDrawerOpen(false)} className="text-primary font-bold">キャンセル</button>
                        {path === yearMonth ?
                            <button onClick={() => setDrawerOpen(false)} className="text-primary font-bold">選択</button>
                            :
                            <Link href={path} className="text-primary font-bold">
                                選択
                            </Link>
                        }
                    </div>
                    <DrawerHeader>
                        <DrawerTitle className="text-center">年月を選択</DrawerTitle>
                    </DrawerHeader>
                    {/* <Dram /> */}
                    <Stack spacing={2} className="mx-auto">
                        <DateScrollPicker value={selectedDate} onChangeValue={handleDateChange} />
                    </Stack>
                </DrawerContent>
            </Drawer>
            <Link
                href={`${next}`}
                className="bg-primary rounded-full"
                style={{
                    boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                    border: `1px solid #D9F3F6`
                }}
            >
                <IoIosArrowDroprightCircle size={'32px'} color={colors.base} />
            </Link>
        </div>
    );
}


