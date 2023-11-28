import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { appName } from "./config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: appName,
  description: "Split your bills hassle-free",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
