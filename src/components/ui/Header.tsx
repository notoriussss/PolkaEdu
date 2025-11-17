'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { spaceGrotesk } from './fonts';
import EducationIcon from '@/src/components/icons/education';
import ConectarWallet from './ConectarWallet';

export default function Header() {
    const pathname = usePathname();
  return (
    <header className={`${spaceGrotesk.className} bg-[#222222] px-4 py-3 w-full fixed top-0 left-0 right-0 z-50 shadow-lg backdrop-blur-sm`}>
      <nav className="flex justify-between items-center">
        <div className="flex justify-between items-center gap-4">
          <Link href="/" className={`${spaceGrotesk.className} font-bold flex items-center gap-2 text-xl`}>
            <EducationIcon className="w-8 h-8" />
            <span>Polka<span className="text-[#E6007A]">Edu</span></span>
          </Link>

          <div className="flex items-center gap-4 font-bold">
            <Link href="/explore" className={`hover:bg-[#DD007633] p-1 px-2 rounded-md transition-colors ${
                pathname === '/explore' || pathname.startsWith('/explore')
                  ? 'bg-[#990052] text-white' 
                  : 'hover:bg-[#DD007633]'
              }`}>
              <span>Explore Courses</span>
            </Link>
            <Link href="/teach" className={`hover:bg-[#DD007633] p-1 px-2 rounded-md transition-colors ${
                pathname === '/teach' || pathname.startsWith('/teach')
                  ? 'bg-[#990052] text-white' 
                  : 'hover:bg-[#DD007633]'
              }`}>
              Teach with Us
            </Link>
            <Link href="/governance" className={`hover:bg-[#DD007633] p-1 px-2 rounded-md transition-colors ${
                pathname === '/governance' || pathname.startsWith('/governance')
                  ? 'bg-[#990052] text-white' 
                  : 'hover:bg-[#DD007633]'
              }`}>
              Governance (DAO)
            </Link>
            <Link href="/my-learning" className={`hover:bg-[#DD007633] p-1 px-2 rounded-md transition-colors ${
                pathname === '/my-learning' || pathname.startsWith('/my-learning')
                  ? 'bg-[#990052] text-white' 
                  : 'hover:bg-[#DD007633]'
              }`}>
              My Learning
            </Link>
            <Link href="/my-certificates" className={`hover:bg-[#DD007633] p-1 px-2 rounded-md transition-colors ${
                pathname === '/my-certificates' || pathname.startsWith('/my-certificates')
                  ? 'bg-[#990052] text-white' 
                  : 'hover:bg-[#DD007633]'
              }`}>
              My Certificates
            </Link>
          </div>
        </div>

        <div>
          <ConectarWallet />
        </div>
      </nav>
    </header>
  );
}