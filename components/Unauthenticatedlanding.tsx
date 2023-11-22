import React, { useContext, useEffect } from "react";
import { MusicContext } from "@/context/MusicContext";
import PageHeader from "./PageHeader";
import { Image } from "@nextui-org/react";
import { PlayingSongCard } from "./PlayingSongCard";
import { Button } from "@nextui-org/react";
import About from "@/pages/about";
import Pricing from "@/pages/pricing";

const UnauthenticatedLanding = () => {
  const context = useContext(MusicContext);
  const musicList = context?.musicList;

  return (
    <div className="flex flex-col items-center justify-start min-h-[200vh] py-2 ">
      <PageHeader>Welcome to CLOVR Records</PageHeader>
      <div className="position-relative flex flex-col items-center">
        <div className="flex flex-row w-[70%] mx-auto justify justify-between">
          <div className="flex flex-col flex-1 ">
            <p className="align-start text-5xl font-bold m-4">
              Your source of freshly picked beats
            </p>
            <p className="text-xl flex-grow">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi non
              nulla nesciunt sapiente quidem dolore magni aperiam, minus
              provident molestiae quaerat quibusdam consequuntur temporibus,
              perferendis perspiciatis sed, optio officiis inventore!
            </p>
            <div className="flex flex-row justify-evenly items-center">
              <Button
                className="hover:scale-105 transition-all duration-200"
                size="lg"
                color="primary"
                onPress={() => {
                  window.location.href = "#pricing";
                }}
              >
                Pricing
              </Button>
              <Button
                className="hover:scale-105 transition-all duration-200"
                color="primary"
                onPress={() => {
                  window.location.href = "#about";
                }}
              >
                About CLOVR
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <Image
              src="/CLOVR_bear.png"
              alt={"IMAGE"}
              className="w-full h-full object-cover" // CSS for the image
            />
          </div>
        </div>
        
      </div>

      <div id="about">
        <About />
      </div>

      <div id="pricing">
        <Pricing />
      </div>
    </div>
  );
};

export default UnauthenticatedLanding;
