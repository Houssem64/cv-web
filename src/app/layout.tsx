import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "Houssem Mehouachi — System Administrator",
  description:
    "System Administrator & IT Support Engineer: Microsoft 365, Entra ID, Intune, Active Directory, Windows Server, Linux, networking, Cloudflare Zero Trust and automation with PowerShell & Python.",
  metadataBase: new URL("https://houssem-mehouachi.netlify.app"),
  openGraph: {
    title: "Houssem Mehouachi — System Administrator",
    description: "Microsoft 365 · Entra ID · Intune · Windows Server · Linux · Networking · Automation",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e0d" },
    { media: "(prefers-color-scheme: light)", color: "#eceee8" },
  ],
};

// Applies the saved theme before first paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
