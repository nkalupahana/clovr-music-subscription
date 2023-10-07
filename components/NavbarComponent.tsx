import React from "react";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
} from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";

const NAV_BUTTONS = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "About", href: "/about" },
];

const NavBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const renderNavigation = () => (
    <NavbarContent className="hidden sm:flex gap-4" justify="center">
      {NAV_BUTTONS.map((button) => (
        <Link href={button.href} key={button.name}>
          <Button
            key={button.name}
            color={router.pathname === button.href ? "primary" : "default"}
          >
            {button.name}
          </Button>
        </Link>
      ))}
    </NavbarContent>
  );

  const renderAuthenticated = () => (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name="Jason Hughes"
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{session?.user?.email}</p>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  const renderUnauthenticated = () => (
    <>
      <Link href="/pricing" underline="always">
        Pricing
      </Link>
      <Button
        color="primary"
        onClick={() => signIn("google")}
        className="pointer-cursor hover:bg-blue-200"
      >
        Sign in with{" "}
        <FcGoogle className="inline-block ml-2 bg-white" size={24} />
      </Button>
    </>
  );

  const renderSmallNavigation = () => (
    <NavbarMenu className="bg-gray-100">
      {NAV_BUTTONS.map((item, index) => (
        <NavbarMenuItem key={index}>
          <Link
            className="w-full"
            href={item.href}
            size="lg"
            color={router.pathname === item.href ? "danger" : "foreground"}
          >
            {item.name}
          </Link>
        </NavbarMenuItem>
      ))}
    </NavbarMenu>
  );

  return (
    <Navbar position="static" maxWidth="full" className="bg-gray-100">
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>
      {renderSmallNavigation()}

      <NavbarBrand>
        <p className="font-bold text-inherit">CLOVR</p>
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
