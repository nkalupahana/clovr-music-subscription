import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
export const HomePage = () => {
  const { data: session, status } = useSession();
  const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-start py-2 relative">
      <div className="flex flex-row w-full justify-between px-4 py-2">
        <h1 className="text-3xl font-bold text-center  ">
          Welome Back, {session?.user.name.split(" ")[0].toUpperCase()}
        </h1>
        {stripeStatus?.status === "unsubscribed" && (
          <h1
            className="text-xl font-semibold cursor-pointer hover:scale-105 transition-all"
            onClick={() => {
              router.push("/pricing");
            }}
          >
            Press here to{" "}
            <span className="text-primary text-2xl font-bold">Subscribe</span>{" "}
            and start whitelisting now!
          </h1>
        )}
      </div>
    </div>
  );
};
