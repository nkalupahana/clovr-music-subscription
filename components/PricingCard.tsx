import React, { useState, useCallback } from "react";
import {
  Card,
  CardBody,
  Image,
  Button,
  Input,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";

import { useSession } from "next-auth/react";
export const PricingCard = ({
  monthlyPrice,
  numChannels,
  image,
}: {
  monthlyPrice: number;
  numChannels: number;
  image: string;
}) => {
  const [channelUrl, setChannelUrl] = useState<string[]>(
    Array.from({ length: numChannels }, (_, index) => "")
  );
  const { data: session, status, update } = useSession();
  const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);

  const subscribe = useCallback(() => {
    window.location.href = "/api/stripe/subscribe";
  }, []);
  return (
    <Card>
      <CardBody>
        <div className="flex flex-col items-center justify-center">
          <Image
            alt="Album cover"
            className="object-cover"
            shadow="md"
            src={image}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-center mt-8">
            {numChannels} Channels
          </h1>
          <h2 className="text-xl text-gray-400 text-center mt-8">
            ${monthlyPrice} / Month
          </h2>
          <h2 className="text-lg text-gray-400 text-center mt-8">
            ${(monthlyPrice / numChannels).toFixed(2)} / Channel
          </h2>

          {status === "authenticated" && !session?.user.subscribed && (
            <>
              <h3 className="text-lg text-gray-400 text-center mt-8 font-bold">
                Enter Channel Links to Subscribe!
              </h3>
              <div className="flex flex-col items-center justify-center mt-8 gap-4">
                {Array.from({ length: numChannels }, (_, index) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-center space-y-4"
                      key={index}
                    >
                      <Input
                        type="url"
                        placeholder="YouTubeChannel.com"
                        labelPlacement="outside"
                        value={channelUrl[index]}
                        onChange={(e) => {
                          const newChannelUrl = [...channelUrl];
                          newChannelUrl[index] = e.target.value;
                          setChannelUrl(newChannelUrl);
                        }}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-medium">
                              https://
                            </span>
                          </div>
                        }
                      />
                    </div>
                  );
                })}
                <button
                  onClick={() => {
                    if (
                      channelUrl.some((url) => url === "") ||
                      channelUrl.length !== numChannels
                    )
                      return;
                    subscribe();
                  }}
                  className={`text-lg f p-2 ${
                    channelUrl.some((url) => url === "") ||
                    channelUrl.length !== numChannels
                      ? "bg-gray-200 text-black"
                      : "bg-primary hover:bg-primary-600 transition-all animate-pulse ont-bold"
                  }  rounded-md  w-full`}
                >
                  Subscribe
                </button>
              </div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
