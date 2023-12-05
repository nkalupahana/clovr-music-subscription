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

  const subscribeToChannels = async () => {
    let base64Channels = btoa(JSON.stringify(channelUrl));
    window.location.href = "/api/stripe/subscribe?channels=" + base64Channels;
  };

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
          <h3 className="text-lg text-gray-400 text-center mt-8 font-bold">
            Enter Channel Links to Subscribe!
          </h3>
          {status === "authenticated" && !session?.user.subscribed && (
            <div className="flex flex-col items-center justify-center mt-8 gap-4 w-full">
              {Array.from({ length: numChannels }, (_, index) => {
                return (
                  <div
                    className="flex flex-row items-center justify-center space-y-4 w-[90%]"
                    key={index}
                  >
                    <Input
                      type="url"
                      placeholder="https://www.youtube.com/@clovrmusic"
                      className="w-full"
                      labelPlacement="outside"
                      value={channelUrl[index]}
                      onChange={(e) => {
                        const newChannelUrl = [...channelUrl];
                        newChannelUrl[index] = e.target.value;
                        setChannelUrl(newChannelUrl);
                      }}
                    />
                  </div>
                );
              })}
              <button
                onClick={async () => {
                  if (
                    channelUrl.some((url) => url === "") ||
                    channelUrl.length !== numChannels
                  )
                    return;
                  // make sure all channels start with ("https://www.youtube.com/@")

                  for (let i = 0; i < channelUrl.length; i++) {
                    if (
                      !channelUrl[i].startsWith("https://www.youtube.com/@")
                    ) {
                      alert(
                        "Please make sure all channels start with https://www.youtube.com/channel/"
                      );
                      return;
                    }
                  }
                  // CONVERT channelUrl to base64
                  // send to backend
                  subscribeToChannels();
                  //subscribe();
                }}
                className={`text-lg f p-2 ${
                  channelUrl.some((url) => url === "") ||
                  channelUrl.length !== numChannels
                    ? "bg-gray-200 text-black"
                    : "bg-primary hover:bg-primary-600 transition-all animate-pulse font-bold"
                }  rounded-md  w-[90%]`}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
