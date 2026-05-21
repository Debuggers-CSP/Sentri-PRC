import { ReactNode } from "react";
import { Navbar } from "./navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    /* We add 'flex flex-col' to stack on mobile, and 'md:flex-row' to go side-by-side on desktop */
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      {/* 'flex-1' ensures the content takes up the remaining space */}
      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}