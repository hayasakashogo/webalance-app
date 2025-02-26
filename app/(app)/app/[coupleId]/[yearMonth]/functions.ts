import { ExpensesData, Params } from "../types";

export const is_validPrams = (paramsData: Params): boolean => {
    const { yearMonth } = paramsData;

    if (isNaN(new Date(`${yearMonth}-01`).getTime())) {
        return false;
    }
    return true;
}

export const formatDate = (inputDate: Date): string => {
    const date = new Date(inputDate); // 文字列から Date オブジェクトを生成
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月を取得 (0 ベースなので +1)
    const day = String(date.getDate()).padStart(2, '0'); // 日を取得
    return `${month}/${day}`;
}

export const getMonthlyTotal = (expenses: ExpensesData[], primaryUserId:string) => {
    return expenses.reduce(
        (totals, expense) => {
            if (expense.user_id === primaryUserId ) {
                totals.primary_user_total += expense.amount;
            } else {
                totals.partner_user_total += expense.amount;
            }
            totals.total_amount += expense.amount;
            return totals;
        },
        { total_amount: 0, primary_user_total: 0, partner_user_total: 0 } 
    );

}
