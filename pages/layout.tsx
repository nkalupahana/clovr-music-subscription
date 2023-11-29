import React, { useState } from "react";
import { NavbarComponent } from "@/components/NavbarComponent";
import { StickyBottomMusicPlayer } from "@/components/StickyBottomMusicPlayer";
import { useSession } from "next-auth/react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(true);
  return (
    <main
      className={`${
        darkMode ? "dark" : ""
      } text-foreground bg-background transition-colors duration-500`}
    >
      <NavbarComponent setDarkMode={setDarkMode} darkMode={darkMode} />
      <div className="flex min-h-screen">
        <div className="flex-1">{children}</div>
      </div>
      {status === "authenticated" && window.innerWidth > 768 && (
        <StickyBottomMusicPlayer />
      )}
    </main>
  );
};

export default Layout;
