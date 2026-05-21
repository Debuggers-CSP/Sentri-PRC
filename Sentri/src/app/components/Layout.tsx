import { ReactNode } from "react";
import { Navbar } from "./navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative"> {/* Added relative */}
      <Navbar />
      {/* Added px-4 for mobile spacing and pb-20 so content doesn't hide under the mobile nav */}
      <main className="px-4 md:px-8 pb-20 md:pb-0"> 
        {children}
      </main>
    </div>
  );
}