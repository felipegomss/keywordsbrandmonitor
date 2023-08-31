"use client";

import SideBar from "@/Components/SideBar";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Keyword Brand Monitor",
  description: "Gerencie as palavras chaves interessantes para o seu negócio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={inter.style} className="w-full m-auto bg-sky-50 max-w-7xl">
        <main className="flex flex-col items-start min-h-screen gap-4 p-4 md:flex-row">
          <SideBar />
          {children}
        </main>
      </body>
    </html>
  );
}
