const Loading = () => {
    return (
        <div className="flex flex-col justify-center items-center bg-primary min-h-screen gap-4">
            <p className="font-bold text-white text-xl">Loading...</p>
            <div className="h-10 w-10 animate-spin border-[5px] border-white rounded-full border-t-transparent"></div>
        </div>
    )
}

export default Loading;
