interface CourseProps{
    title: string;
    module: string;
    onBack: () => void;
}
export default function CourseInfo( {title, module, onBack} : CourseProps){
    return(
        <div className="sticky top-14 w-full h-15 bg-[#222222] border-t border-[#E6007A]  z-50">
            <div className=" flex items-center px-8 mt-3 justify-between">
                <div>
                    <span className="text-lg font-bold">Active Course: <span className="text-[#E6007A] text-base">{title}</span></span>
                    <span className="text-[#fbfbfb66]"> - {module}</span>
                </div>
                <button onClick={onBack} className=" cursor-pointer hover:bg-[#990052] bg-[#EA007A] font-bold font-sm p-2 rounded-md relative"> Back to My Learning</button>
            </div>
        </div>
    )
}