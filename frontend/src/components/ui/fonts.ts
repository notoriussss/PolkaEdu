import { Space_Grotesk } from 'next/font/google';
import { Manrope } from 'next/font/google';
 
export const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  weight: ["400", "500", "600", "700"],
  variable: '--font-space-grotesk'
});

export const manrope = Manrope({ 
  subsets: ['latin'], 
  weight: ["400", "500", "600", "700"],
  variable: '--font-manrope'
});