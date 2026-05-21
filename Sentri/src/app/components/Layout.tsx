import { ReactNode } from "react";
import { Navbar } from "./navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    /* We use flex-col so that Navbar is on top and main is on bottom */
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      {/* overflow-x-hidden prevents the iPhone side-to-side wiggle */}
      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}