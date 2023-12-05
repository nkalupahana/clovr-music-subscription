import React, { useState, useEffect, useCallback } from "react";
import { fetcher } from "@/lib/swr";
import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import VerifyAuthenticationStatus from "@/components/HigherOrderComponents/VerifyAuthenticationStatus";
import { PricingInformation } from "@/components/PricingInformation";
import { DownloadsTable } from "@/components/DownloadsTable";

export default function Subscriptions() {
  const { data: session, status, update } = useSession();
  const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);
  const { data: userDownloads } = useSWR("/api/my/downloads", fetcher);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user.subscribed) {
      setIsSubscribed(true);
    }
  }, [session?.user.subscribed]);

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
    <>
      <div className="content-container drop-in">
        {session?.user.subscribed ? (
          <>
            <div className="flex flex-row flex-wrap gap-4 mt-8">
              <Button
                onClick={() => manage("subscription_update")}
                color="primary"
                size="lg"
              >
                Add/Remove Channels
              </Button>
              <Button onClick={() => manage("payment_method_update")} size="lg">
                Change Payment Method
              </Button>

              {!stripeStatus?.cancelAt ? (
                <Button
                  onClick={() => manage("subscription_cancel")}
                  color="danger"
                  size="lg"
                >
                  Cancel Subscription
                </Button>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <Button
                    onClick={() => manage("uncancel")}
                    color="success"
                    size="lg"
                  >
                    Renew Subscription
                  </Button>
                  <p className="text-sm text-center ">
                    Subscription Will Expire On:{" "}
                    <span className="font-bold">
                      {new Date(
                        stripeStatus.cancelAt * 1000
                      ).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col items-start justify-start mt-8 gap-4 w-[80%]">
              <span className="font-bold text-lg">Your Channels:</span>
              <ul className="list-disc list-inside">
                {stripeStatus?.channels.map((channel: string) => {
                  return <li key={channel}>{channel}</li>;
                })}
              </ul>
            </div>

            <div className="flex flex-col items-start justify-start mt-8 gap-4 w-[80%]">
              <span className="font-bold text-lg">Your Downloads:</span>
              {userDownloads && (
                <DownloadsTable userDownloads={userDownloads} />
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold text-center bg-primary text-white text-shadow-lg p-4 rounded-md">
              Subscribe Your Channel To Whitelist!!
            </h1>
            <PricingInformation />
          </>
        )}
      </div>
    </>
  );
}
