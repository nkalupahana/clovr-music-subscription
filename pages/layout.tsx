import React from "react";
import NavBar from "../components/NavbarComponent";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />

      <div className="flex h-screen">
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
};

export default Layout;
