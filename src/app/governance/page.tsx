import MetricsCard from "@/src/components/ui/MetricsCard";
import GovernanceCard from "@/src/components/ui/GovernaceCard";
import { UserGroupIcon, CurrencyDollarIcon, BanknotesIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Governance() {
  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      <div className="p-10">
        <div>
          <h1 className="text-4xl font-bold">Governance 
          <span className="text-[#E6007A]"> (DAO)</span></h1>
          <p className="mt-2 justify-start text-xl text-[#FBFBFB66] font-bold">
          The future of PolkaEdu is in your hands. Participate in decision-making, fund proposals and lead the most innovative educational platform in the Polkadot ecosystem.
          </p>
        </div>
        <div className="mt-10 flex gap-10 justify-center">
          <MetricsCard text="DAO Treasury" value="2.5M DOT"/>
          <MetricsCard text="Active Proposals" value="14"/>
          <MetricsCard text="Unique Voters" value="15.4K"/>
          <MetricsCard text="Average Participation" value="78.5%"/>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold">Our Decentralized Philosophy</h2>
          <div className="flex gap-12 mt-7 justify-center">
            <GovernanceCard title="Voice and Vote" icon={<UserGroupIcon className="w-10 h-10" />} description="Decide which new courses will be funded, approve new instructors and vote on key updates to the educational protocol. Each token has weight."/>
            <GovernanceCard title="Decentralized Incentives" icon={<CurrencyDollarIcon className="w-10 h-10" />} description="Earn governance token rewards by actively participating in moderation, tutoring and creating new modules."/>
            <GovernanceCard title="Treasury Funds" icon={<BanknotesIcon className="w-10 h-10" />} description="The DAO Treasury funds projects, hackathons and platform expansion. Submit your proposal and get resources to build PolkaEdu."/>
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/" className="w-md h-10 flex items-center justify-center bg-[#990052] rounded-lg overflow-hidden hover:bg-[#990052]/90 transition-colors">
              <span className="text-[#FBFBFB] text-base font-bold">View All Proposals</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
