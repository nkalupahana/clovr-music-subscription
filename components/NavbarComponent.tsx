import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import {
  Chip,
  Navbar,
  NavbarBrand,
  NavbarContent,
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

// const NAV_BUTTONS = [
//   { name: "Home", href: "/" },
//   { name: "Explore", href: "/explore" },

//   { name: "Subscriptions", href: "/subscriptions" },
// ];

export const NavbarComponent = ({
  setDarkMode,
  darkMode,
}: {
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
}) => {
  const NAV_BUTTONS = useMemo(
    () => [
      { name: "Home", href: "/" },
      { name: "Explore", href: "/explore" },
      { name: "Subscriptions", href: "/subscriptions" },
    ],
    []
  );
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const AuthenticatedNavigation = () => (
    <NavbarContent className="hidden sm:flex gap-4" justify="center">
      {NAV_BUTTONS.map((button) => (
        <Link href={button.href} key={button.name}>
          <Chip
            color={pathname === button.href ? "primary" : "default"}
            variant="shadow"
            className="text-2xl p-4 hover:scale-105 transition-transform"
            id={button.name}
          >
            {button.name}
          </Chip>
        </Link>
      ))}
    </NavbarContent>
  );

  const AuthenticatedDropdown = () => (
    <Dropdown placement="bottom-end" id="dropdown">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name="Jason Hughes"
          size="md"
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

  const UnauthenticatedNavigation = () => (
    <>
      <Link href="/about" className="text-lg">
        About
      </Link>

      <SignInWithGoogle />
    </>
  );

  const [smallMenuOpen, setSmallMenuOpen] = useState(false);

  const AuthenticatedNavigationSmall = () => (
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

  const LogoAndSwitch = () => (
    <div className="flex justify-between items-center">
      <Link href="/">
        <div className="p-2 cursor-pointer " id="logo">
          <Image src="/CLOVR_Logo.png" alt="CLOVR" width={150} height={150} />
        </div>
      </Link>
      <Switch
        onChange={() => setDarkMode(!darkMode)}
        size="sm"
        color="success"
        className="ml-2"
        startContent={<HiOutlineSun />}
        endContent={<FaMoon />}
      />
    </div>
  );

  return (
    <Navbar
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
      <AuthenticatedNavigationSmall />

      <NavbarBrand>
        <LogoAndSwitch />
      </NavbarBrand>
      {status === "authenticated" && <AuthenticatedNavigation />}
      <NavbarContent justify="end">
        {status === "unauthenticated" ? (
          <UnauthenticatedNavigation />
        ) : (
          <AuthenticatedDropdown />
        )}
      </NavbarContent>
    </Navbar>
  );
};
