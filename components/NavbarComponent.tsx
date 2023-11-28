import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Chip,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  Image,
  Switch,
} from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { FaMoon } from "react-icons/fa";
import { HiOutlineSun } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInWithGoogle } from "./SignInWithGoogle";

const NAV_BUTTONS = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },

  { name: "Subscriptions", href: "/subscriptions" },
];

const NavBar = ({
  setDarkMode,
  darkMode,
}: {
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const renderNavigation = () => (
    <NavbarContent className="hidden sm:flex gap-4" justify="center">
      {NAV_BUTTONS.map((button) => (
        <Link href={button.href} key={button.name}>
          <Chip
            color={pathname === button.href ? "primary" : "default"}
            variant="shadow"
            className="text-lg p-2 hover:scale-105 transition-transform"
            id={button.name}
          >
            {button.name}
          </Chip>
        </Link>
      ))}
    </NavbarContent>
  );

  const renderAuthenticated = () => (
    <Dropdown placement="bottom-end" id="dropdown">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name="Jason Hughes"
          size="sm"
          src={session?.user?.image}
          id="dropdown-trigger"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{session?.user?.email}</p>
        </DropdownItem>
        {session?.user?.isAdmin && (
          <DropdownItem
            key="admin-dashboard"
            onPress={() => router.push("/admin-dashboard")}
          >
            Admin Dashboard
          </DropdownItem>
        )}
        <DropdownItem
          key="about"
          onPress={() => router.push("/about")}
          id="about"
        >
          About CLOVR
        </DropdownItem>
        <DropdownItem
          key="pricing"
          onPress={() => router.push("/pricing")}
          id="pricing"
        >
          Pricing Info
        </DropdownItem>

        <DropdownItem
          key="logout"
          color="danger"
          onPress={() => {
            signOut();
            router.push("/");
          }}
          id="logout"
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  const renderUnauthenticated = () => (
    <>
      <Link href="/about" className="text-lg">
        About
      </Link>
      <SignInWithGoogle />
    </>
  );

  const [smallMenuOpen, setSmallMenuOpen] = useState(false);

  const renderSmallNavigation = () => (
    <NavbarMenu className="bg-gray-100">
      {NAV_BUTTONS.map((item, index) => (
        <NavbarMenuItem key={index}>
          <Link href={item.href} onClick={() => setSmallMenuOpen(false)}>
            <Chip
              color={pathname === item.href ? "primary" : "default"}
              variant="shadow"
            >
              {item.name}
            </Chip>
          </Link>
        </NavbarMenuItem>
      ))}
    </NavbarMenu>
  );

  return (
    <Navbar
      position="static"
      maxWidth="full"
      isMenuOpen={smallMenuOpen}
      isBordered
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          onClick={() => setSmallMenuOpen(!smallMenuOpen)}
          className="text-2xl"
        />
      </NavbarContent>
      {renderSmallNavigation()}

      <NavbarBrand>
        <div
          className="p-2 cursor-pointer "
          onClick={() => {
            router.push("/");
          }}
          id="logo"
        >
          <Image src="/CLOVR_Logo.png" alt="CLOVR" width={150} height={150} />
        </div>
        <Switch
          onChange={() => setDarkMode(!darkMode)}
          size="sm"
          color="success"
          className="ml-2"
          startContent={<HiOutlineSun />}
          endContent={<FaMoon />}
        />
      </NavbarBrand>
      {status === "authenticated" && renderNavigation()}
      <NavbarContent justify="end">
        {status === "unauthenticated"
          ? renderUnauthenticated()
          : renderAuthenticated()}
      </NavbarContent>
    </Navbar>
  );
};

export default NavBar;
