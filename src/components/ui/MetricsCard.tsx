interface MetricsProp{
    text: string;
    value: string;
}

export default function MetricsCard(
    {text, value}: MetricsProp){
    return(
        <div className="w-70 h-40 flex flex-col items-center justify-center bg-[#222222] rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#E6007A] overflow-hidden">
            <div className="text-center text-[#E6007A] text-4xl font-bold">{value}</div>
            <div className="text-center text-[#FBFBFB66] text-lg font-medium">{text}</div>
        </div>
    )
}