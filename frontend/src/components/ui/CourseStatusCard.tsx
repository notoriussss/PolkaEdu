'use client';

interface CourseStatusCardProps {
    title: string;
    nextModule?: string;
    status: string;
    progress: number;
    duration: string;
    onResume?: () => void;
    onDelete?: () => void;
}

export default function CourseStatusCard({ 
    title, 
    nextModule, 
    status, 
    progress, 
    duration, 
    onResume, 
    onDelete 
}: CourseStatusCardProps) {
    return (
        <div className="w-full h-60 relative bg-neutral-800 rounded-3xl overflow-hidden p-6 flex flex-col">
            <h3 className="text-2xl font-bold text-neutral-50 mb-3">{title}</h3>
            
            <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                    <div className="bg-pink-300 rounded-2xl px-3 py-0.5">
                        <span className="text-pink-600 text-xs font-bold">{status}</span>
                    </div>
                </div>

                {nextModule && (
                    <div className="text-neutral-50/40 text-lg font-bold">
                        Next: {nextModule}
                    </div>
                )}
                
                <div className="text-neutral-50/40 text-lg font-bold ml-auto">
                    {duration} Total
                </div>
            </div>
            
            <div className="w-full h-6 bg-neutral-700 rounded-2xl overflow-hidden relative mb-4">
                <div 
                    className="h-full bg-pink-600 rounded-2xl transition-all"
                    style={{ width: `${progress}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-neutral-50 text-base font-semibold">{progress}% completed</span>
                </div>
            </div>
            
            <div className="flex gap-3 mt-4 justify-center">
                <button
                    onClick={onResume}
                    className="w-md px-6 h-10 bg-pink-800 rounded-lg overflow-hidden hover:bg-pink-900 transition-colors cursor-pointer flex items-center justify-center"
                >
                    <span className="text-neutral-50 text-base font-bold">Resume Course</span>
                </button>
                <button
                    onClick={onDelete}
                    className="w-md px-6 h-10 bg-neutral-700 rounded-lg overflow-hidden hover:bg-neutral-600 transition-colors cursor-pointer flex items-center justify-center"
                >
                    <span className="text-neutral-50 text-base font-bold">Remove Course</span>
                </button>
            </div>
        </div>
    );
}