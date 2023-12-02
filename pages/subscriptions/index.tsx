import React, { useState, useEffect, useCallback } from "react";
import { fetcher } from "@/lib/swr";
import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import VerifyAuthenticationStatus from "@/components/HigherOrderComponents/VerifyAuthenticationStatus";
import { PricingInformation } from "@/components/PricingInformation";

export default function Subscriptions() {
  const { data: session, status, update } = useSession();
  const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [channelUrl, setChannelUrl] = useState<string>("");

  useEffect(() => {
    console.log("FAG");
    if (session?.user.subscribed) {
      setIsSubscribed(true);
    }
  }, [session?.user.subscribed]);

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
      <div className="content-container">
        {isSubscribed ? (
          <h1 className="text-3xl font-bold text-center">
            You are already subscribed!
          </h1>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold text-center bg-primary text-white text-shadow-lg p-4 rounded-md">
              Subscribe Your Channel To Whitelist!!
            </h1>
            <PricingInformation />
          </>
        )}
        

        {session?.user.subscribed && stripeStatus && (
          <>
            <p>
              <strong>Subscription Status:</strong> {stripeStatus.status}
            </p>
            <p>
              <strong>Number of Channels Purchased:</strong>{" "}
              {stripeStatus.quantity}
            </p>
          </>
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
                <h1>
                  Subscription Will Expire On:{" "}
                  {new Date(stripeStatus.cancelAt * 1000).toLocaleDateString()}
                </h1>
              </div>
            )}
          </div>
        )}
        <br />
      </div>
    </VerifyAuthenticationStatus>
  );
}
