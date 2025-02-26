import { FC, useMemo, useCallback } from "react";
import { Stack, Typography } from "@mui/material";
import { ScrollPicker } from "./ScrollPicker";
import { addYears, clamp as clampDate } from "date-fns";

const CURRENT_DATE = new Date();
const DEFAULT_MIN_DATE = addYears(CURRENT_DATE, -10);
const DEFAULT_MAX_DATE = addYears(CURRENT_DATE, 10);

export type DateScrollPickerProps = {
    /** 年月 */
    value: Date;
    /** 最小日付 */
    minDate?: Date;
    /** 最大日付 */
    maxDate?: Date;
    /**
     * 年月が変更された時
     * @param newValue - 新しい年月
     */
    onChangeValue: (newValue: Date) => void;
};

// range関数の代替を実装
const generateRange = (start: number, end: number) => {
    const rangeArray: number[] = [];
    for (let i = start; i < end; i++) {
        rangeArray.push(i);
    }
    return rangeArray;
};

export const DateScrollPicker: FC<DateScrollPickerProps> = ({
    value,
    minDate = DEFAULT_MIN_DATE,
    maxDate = DEFAULT_MAX_DATE,
    onChangeValue,
}) => {
    const { year, month } = useMemo(() => {
        return {
            year: value.getFullYear(),
            month: value.getMonth() + 1,
        };
    }, [value]);

    const yearItems = useMemo(() => {
        return generateRange(minDate.getFullYear(), maxDate.getFullYear() + 1).map(
            (year) => ({
                value: year,
                label: `${year}`,
            })
        );
    }, [minDate, maxDate]);

    const monthItems = useMemo(() => {
        return generateRange(1, 13).map((month) => {
            const yearMonthFirst = new Date(year, month - 1, 1, 0, 0, 0);
            const yearMonthLast = new Date(year, month, 0, 23, 59, 59);
            return {
                value: month,
                label: `${month}`,
                disabled: yearMonthLast < minDate || yearMonthFirst > maxDate,
            };
        });
    }, [maxDate, minDate, year]);

    const handleChangeValue = useCallback(
        (newDate: Date) => {
            onChangeValue(
                clampDate(newDate, {
                    start: minDate,
                    end: maxDate,
                })
            );
        },
        [maxDate, minDate, onChangeValue]
    );

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <ScrollPicker
                value={year}
                items={yearItems}
                onChangeValue={(newYear) => {
                    handleChangeValue(new Date(newYear, month - 1));
                }}
            />
            <Typography>年</Typography>
            <ScrollPicker
                value={month}
                items={monthItems}
                onChangeValue={(newMonth) => {
                    handleChangeValue(new Date(year, newMonth - 1));
                }}
            />
            <Typography>月</Typography>
        </Stack>
    );
};
