import { useSession, signIn, signOut } from "next-auth/react";
import UnauthenticatedLanding from "@/components/UnauthenticatedLandingPage";

import { HomePage } from "@/components/HomePage";

const Index = () => {
  const { data: session, status } = useSession();
  return (
    <>
      {status === "unauthenticated" ? <UnauthenticatedLanding /> : <HomePage />}
    </>
  );
};

export default Index;
