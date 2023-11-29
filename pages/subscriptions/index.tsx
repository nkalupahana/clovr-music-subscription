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

  // useEffect(() => {
  //   const url = new URL(window.location.href);
  //   const upd = url.searchParams.get("update");
  //   if (upd?.trim() === "true") {
  //     update();
  //     window.location.search = "";
  //   }
  // }, [update]);

  useEffect(() => {
    if (stripeStatus) {
      update();
    }
  }, [stripeStatus]); // eslint-disable-line react-hooks/exhaustive-deps
  

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
          <div>
            <p className={session?.user.subscribed ? "text-center text-xl" : "text-center"}>
              <strong>Subscription Status: </strong>
              {session?.user.subscribed ? "You are subscribed!" : "You are not subscribed"}
            </p>
            {!session?.user.subscribed && (
              <ul className="list-disc pl-4 text-gray-500">
              <li>A Subscription is $3.99 per month. It allows you to use our music in your YouTube content without recieving a copyright strike</li>
              <li>Any use of our music in your content during the duration of your subscription will be valid forever</li>
              <li>If you cancel your subscription, it will expire one month after the puchase date</li>
              {/* Add more features as needed */}
            </ul>
            )}
          </div>
        )}
        {session?.user.subscribed && stripeStatus && (
          <>
            <p>
              <strong>Subscription Status:</strong> {stripeStatus.status}
            </p>
            <p>
              <strong>Number of Channels Purchased:</strong> {stripeStatus.quantity}
            </p>
          </>
        )}
        {!session?.user.subscribed && (
          <Button className="m-2" onClick={subscribe}>
            Subscribe
          </Button>
        )}
        {session?.user.subscribed && stripeStatus && (
          <div className="flex flex-col">
            <div className="flex flex-row flex-wrap gap-4 mt-8">
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
            {stripeStatus.cancelAt && (
              <div className="flex flex-row flex-wrap gap-4 mt-4 m-auto">
                <h1>Subscription Will Expire On: {new Date(stripeStatus.cancelAt * 1000).toLocaleDateString()}</h1>
              </div>
            )}
          </div>
        )}
        <br />
      </div>
    </VerifyAuthenticationStatus>
  );
}
