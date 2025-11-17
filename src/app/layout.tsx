import type { Metadata } from "next";
import Header from "@/src/components/ui/Header";
import { spaceGrotesk, manrope } from "@/src/components/ui/fonts";
import WalletProviderWrapper from "@/src/components/providers/WalletProviderWrapper";
import "./globals.css";
import Footer from "../components/ui/Footer";

export const metadata: Metadata = {
  title: "PolkaEdu",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} ${manrope.className} antialiased pt-16`}
      >
        <WalletProviderWrapper>
          <Header />
          {children}
          <Footer backgroundColor="900"/>
        </WalletProviderWrapper>
        
      </body>

    </html>
  );
}
