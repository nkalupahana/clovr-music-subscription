import React from "react";
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
  return (
    <main className="light">
      <NavBar />

      <div className="flex h-screen">
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
