interface GovernanceProps {
    title: string;
    icon: React.ReactNode;
    description: string;
}

export default function GovernanceCard({ title, icon, description }: GovernanceProps) {
    return (
        <div className="bg-[#222222] rounded-3xl px-6 py-8 w-xs">
            <div className="text-[#E6007A] mb-4">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-neutral-50 mb-3">{title}</h3>
            <p className="text-base text-[#FBFBFB66] leading-relaxed">{description}</p>
        </div>
    );
}