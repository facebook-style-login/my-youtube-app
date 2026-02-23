
"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { SVGProps } from 'react';
import { usePathname } from 'next/navigation'; // Correct hook for client components

const inter = Inter({ subsets: ["latin"] });

// Metadata can't be dynamically changed on the client, so it's defined statically.
// export const metadata: Metadata = { ... }; // Keep your static metadata here

// --- ICON COMPONENTS ---
const IconWrapper = (props: SVGProps<SVGSVGElement> & { path: string; paths?: string[] }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {props.path && <path d={props.path} />}
        {props.paths && props.paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
);
const HomeIcon = (props: SVGProps<SVGSVGElement>) => <IconWrapper {...props} path="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" paths={["M9 22V12h6v10"]} />;
const SettingsIcon = (props: SVGProps<SVGSVGElement>) => <IconWrapper {...props} path="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" paths={["M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0"]} />;
const TrendingUpIcon = (props: SVGProps<SVGSVGElement>) => <IconWrapper {...props} path="M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6" />;


const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'bg-blue-600/20 text-blue-300' : 'text-muted-foreground hover:bg-secondary/50 hover:text-white'}`}>
            {children}
        </Link>
    );
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <div className="flex min-h-screen w-full">
          <aside className="flex-col border-r border-border bg-secondary/20 p-4 w-64 hidden sm:flex">
              <div className="flex items-center gap-3 mb-8 px-3">
                  <TrendingUpIcon className="h-8 w-8 text-blue-500" />
                  <h1 className="text-2xl font-bold">Trendlytics</h1>
              </div>
              <nav className="flex flex-col space-y-2">
                  <NavLink href="/">
                      <HomeIcon className="h-5 w-5" />
                      <span>Dashboard</span>
                  </NavLink>
                  <NavLink href="/settings">
                      <SettingsIcon className="h-5 w-5" />
                      <span>Settings</span>
                  </NavLink>
              </nav>
          </aside>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
