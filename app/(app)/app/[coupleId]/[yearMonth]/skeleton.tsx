'use client'

export default function ExpensesSkeleton() {
    return (
        <div className="grid grid-rows-[auto_1fr] w-[97%] mx-auto gap-4 animate-pulse">

            {/* PieChartSection Skeleton */}
            <div
                className="rounded-2xl py-6 grid grid-cols-[200px_1fr] place-items-center"
                style={{
                    boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                    border: `1px solid #D9F3F6`
                }}
            >
                <div className="w-[150px] h-[150px] rounded-full bg-slate-200" />
                <div className="w-[150px] pr-6 space-y-10">
                    <div className="h-6 bg-slate-200 rounded-md" />
                    <div className="h-6 bg-slate-200 rounded-md" />
                </div>
            </div>

            {/* Filter / RadioGroup Skeleton */}
            <div
                className="rounded-2xl p-3 flex items-center justify-between"
                style={{
                    boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                    border: `1px solid #D9F3F6`
                }}
            >
                <div className="w-7 h-7 rounded-sm bg-slate-200 p-3" />
                    <div className="h-4 w-12 bg-slate-200 rounded-md" />
                    <div className="h-4 w-12 bg-slate-200 rounded-md" />
                    <div className="h-4 w-12 bg-slate-200 rounded-md" />
            </div>

            {/* Expenses Table Skeleton */}
            <div
                className="rounded-2xl p-5 space-y-3 overflow-hidden"
                style={{
                    boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                    border: `1px solid #D9F3F6`
                }}
            >
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center gap-4 w-full">
                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                        <div className="h-4 w-[12%] bg-slate-200 rounded-md" />
                        <div className="h-4 w-[24%] bg-slate-200 rounded-md" />
                        <div className="h-4 w-[16%] bg-slate-200 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    )
}
