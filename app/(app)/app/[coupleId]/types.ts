export interface CoupleData {
    id: string;
    custom_couple_id: string;
    image_url: string | undefined;
    primary_user: UserData;
    partner_user: UserData | null;
}

export interface ExpensesData {
    id: string;
    date: Date;
    amount: number;
    item: string;
    user_id: string;
    couple_id: string;
    year_month: string;
}

export interface MonthlyTotalsData {
    id: string;
    total_amount: number;
    primary_user_total: number;
    partner_user_total: number;
    couple_id: string;
    year_month: string;
}

export interface UserData {
    id: string;
    name: string;
    icon_url: string | undefined;
}

export interface FormattedUserData {
    id: string | undefined;
    name: string | undefined;
    icon: string | undefined;
}

export interface CoupleParams {
    coupleId: string;
}
export interface ExpensesParams {
    coupleId: string;
    yearMonth: string;
}

export interface ExpensesLayoutProps {
    children: React.ReactNode;
    params: Promise<ExpensesParams>;
}
export interface CoupleLayoutProps {
    children: React.ReactNode;
    params: Promise<CoupleParams>;
}
