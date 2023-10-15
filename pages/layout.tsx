import React, { useState } from "react";
import NavBar from "../components/NavbarComponent";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <main
      className={`
    ${darkMode ? "dark" : ""} text-foreground bg-background 
    `}
    >
      <NavBar setDarkMode={setDarkMode} darkMode={darkMode}/>
      <div className="flex min-h-screen">
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
