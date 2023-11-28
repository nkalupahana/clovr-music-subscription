import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import UnauthenticatedLanding from "@/components/Unauthenticatedlanding";

import { HomePage } from "@/components/HomePage";

export default function Index() {
  const { data: session, status } = useSession();
  const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);
  return (
    <>
      {status === "unauthenticated" ? <UnauthenticatedLanding /> : <HomePage />}
    </>
  );
}
