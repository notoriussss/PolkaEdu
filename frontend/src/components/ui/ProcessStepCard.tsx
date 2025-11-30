import { ElementType } from "react";

interface ProcessStepCardProps {
  icon: ElementType;
  title: string;
  description: string;
  className?: string;
}

export default function ProcessStepCard({
  icon: Icon,
  title,
  description,
  className = "",
}: ProcessStepCardProps) {
  return (
    <div
      className={`px-9 py-6 bg-neutral-800 rounded-[30px] outline-2 outline-transparent transition-all duration-300 ease-in-out hover:outline-pink-600 hover:outline-4 hover:scale-[1.02] hover:-translate-y-1 flex flex-col justify-center items-center gap-3 text-center ${className}`}
    >
      <Icon className="w-20 h-20 text-pink-600 shrink-0" />
      <h2 className="text-neutral-50 text-2xl font-bold leading-tight">
        {title}
      </h2>
      <p className="text-neutral-50/40 text-base font-semibold -mt-1">
        {description}
      </p>
    </div>
  );
}

