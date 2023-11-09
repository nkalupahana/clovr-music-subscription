import { fetcher } from "@/lib/swr";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import useSWR from "swr";
import VerifyAuthenticationStatus from "@/components/HigherOrderComponents/VerifyAuthenticationStatus";

export default function Subscriptions() {
  const { data: session, status, update } = useSession();
  const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);

  useEffect(() => {
    const url = new URL(window.location.href);
    const upd = url.searchParams.get("update");
    if (upd?.trim() === "true") {
      update();
      window.location.search = "";
    }
  }, [update]);

  const subscribe = useCallback(() => {
    window.location.href = "/api/stripe/subscribe";
  }, []);

  const manage = useCallback((op: string) => {
    window.location.href = "/api/stripe/manage?op=" + op;
  }, []);

  return (
    <VerifyAuthenticationStatus>
      <div className="flex flex-col items-center justify-start min-h-[200vh]  py-2">
        <PageHeader>Subscriptions</PageHeader>
        {status === "authenticated" && (
          <p>
            <strong>Subscribed: </strong>
            {String(session?.user?.subscribed)}
          </p>
        )}
        {session?.user.subscribed && stripeStatus && (
          <>
            <p>
              <strong>Subscription Status:</strong> {stripeStatus.status}
            </p>
            <p>
              <strong>Max Channels:</strong> {stripeStatus.quantity}
            </p>
          </>
        )}
        {!session?.user.subscribed && (
          <Button className="m-2" onClick={subscribe}>
            Subscribe
          </Button>
        )}
        {session?.user.subscribed && stripeStatus && (
          <div className="flex flex-row gap-4 mt-8">
            <Button onClick={() => manage("payment_method_update")}>
              Change Payment Method
            </Button>
            <Button onClick={() => manage("subscription_update")}>
              Add/Remove Channels
            </Button>
            {!stripeStatus.cancelAt && (
              <Button onClick={() => manage("subscription_cancel")}>
                Cancel Subscription
              </Button>
            )}
            {stripeStatus.cancelAt && (
              <Button onClick={() => manage("uncancel")}>
                Uncancel Subscription
              </Button>
            )}
          </div>
        )}
        <br />
        <Button onClick={() => update()}>Update</Button>
      </div>
    </VerifyAuthenticationStatus>
  );
}
