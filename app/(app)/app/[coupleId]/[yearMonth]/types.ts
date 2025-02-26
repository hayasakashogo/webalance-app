type CoupleData = {
    id: string;
    custom_couple_id: string;
    image_url: string | undefined;
    primary_user: UserData;
    partner_user: UserData | null;
};

type ExpensesData = {
    id: string;
    date: Date;
    amount: number;
    item: string;
    user_id: string;
    couple_id :string;
    year_month:string;
}

type MonthlyTotalsData = {
    id: string;
    total_amount: number;
    primary_user_total: number;
    partner_user_total: number;
    couple_id :string;
    year_month:string;
}

type UserData = {
    id: string;
    name: string;
    icon_url: string | undefined;
};

type FormattedUserData={
    id:string | undefined;
    name:string | undefined;
    icon:string | undefined;
}

type Params = {
    coupleId:string;
    yearMonth:string
}

type ExpensesLayoutProps = {
    children: React.ReactNode;
    params:Promise<Params>
}