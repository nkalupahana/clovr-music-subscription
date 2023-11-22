import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import UnauthenticatedLanding from "@/components/Unauthenticatedlanding";
import {SubscribedLanding} from "@/components/SubscribedLanding";
import {UnsubscribedLanding} from "@/components/UnsubscribedLanding";

export default function Index() {
  const { data: session, status } = useSession();
  const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);
  return (
    <>
      {status === "unauthenticated" ? (
        <UnauthenticatedLanding />
      ) : stripeStatus ? (
        <SubscribedLanding />
      ) : (
        <UnsubscribedLanding />
      )}
    </>
  );
}
