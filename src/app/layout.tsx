import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import Navbar from "../components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "💔Weather App",
  description: "Developed by Nitish",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Navbar /> */}
        <div>
          <div className=" bg-black text-white flex items-center justify-around p-3">
            <div>WEATHER</div>
            <div
              id={"SearchBarPortal"}
              className="Search-bar-portal w-[500px]"
            ></div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
