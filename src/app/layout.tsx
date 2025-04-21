import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Backend Developer | Java & Spring Boot Specialist",
  description: "Backend developer specializing in Java, Spring Boot, and building robust APIs and microservices for enterprise applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
