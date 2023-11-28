import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { MusicContext } from "@/context/MusicContext";
import { Button, Divider, Card, CardBody, Image } from "@nextui-org/react";
import { LandingSongCard } from "./LandingSongCard";
import { PricingCard } from "./PricingCard";
import { LandingFooter } from "./LandingFooter";

const UnauthenticatedLanding = () => {
  const context = useContext(MusicContext);
  const router = useRouter();
  const musicList = context?.musicList;
  const [playingSong, setPlayingSong] = React.useState<any>(null);

  return (
    <div className="flex flex-col items-center justify-start py-2 ">
      <div className="flex flex-col items-center justify-center w-[75%]">
        <h1 className="text-6xl font-bold text-center">
          Royalty Free <span className="text-primary">Music</span> For Your
          Content
        </h1>
        <h2 className="text-3xl text-gray-400 text-center mt-16">
          Get unlimited access to our music and sound effects catalog for your
          videos, streams and podcasts. Our license comes with all necessary
          rights included.
        </h2>
        <div className="flex flex-row mt-16 gap-4">
          <Button
            onClick={() => console.log("clicked")}
            size={"lg"}
            radius={"none"}
            color="primary"
          >
            <span className="text-xl">Get Started</span>
          </Button>
          <Button
            onClick={() => {
              router.push("/about");
            }}
            size={"lg"}
            radius={"none"}
          >
            <span className="text-xl">About CLOVR</span>
          </Button>
        </div>
      </div>
      <Divider className="w-[75%] mt-16" />
      <h1 className="text-4xl font-bold text-center mt-16">
        Checkout Some of Our Music
      </h1>
      {musicList && (
        <div className="grid-container mt-8 w-[75%]">
          <LandingSongCard
            playingSong={playingSong}
            setPlayingSong={setPlayingSong}
            song={musicList[0]}
          />
          <LandingSongCard
            playingSong={playingSong}
            setPlayingSong={setPlayingSong}
            song={musicList[1]}
          />
          <LandingSongCard
            playingSong={playingSong}
            setPlayingSong={setPlayingSong}
            song={musicList[2]}
          />
          <LandingSongCard
            playingSong={playingSong}
            setPlayingSong={setPlayingSong}
            song={musicList[3]}
          />
        </div>
      )}
      <Divider className="w-[75%] mt-16" />
      <h1 className="text-4xl font-bold text-center mt-16">
        About Our Pricing Plans
      </h1>
      <div className="flex flex-col items-center justify-center w-[75%] mt-8 mb-8">
        <h2 className="text-3xl text-gray-400 text-center mt-16">
          Get unlimited access to our music and sound effects catalog for your
          videos, streams and podcasts. Our license comes with all necessary
          rights included.
        </h2>
        <div className="flex flex-row mt-16 gap-12">
          <PricingCard
            price={"$3.99 / Month"}
            name={"1 Channel"}
            image={"CLOVR_bear_2.png"}
          />
          <PricingCard
            price={"$9.99 / Month"}
            name={"3 Channels"}
            image={"CLOVR_bear_3.png"}
          />
          <PricingCard
            price={"$12.99 / Month"}
            name={"5 Channels"}
            image={"CLOVR_bear_4.png"}
          />
        </div>
        <h2 className="text-xl text-gray-400 text-center mt-16">
          Not ready to commit? Sign in with your Google account and explore our
          songs!
        </h2>
        <Button
          color="primary"
          onClick={() =>
            signIn(process.env.NODE_ENV === "development" ? "email" : "google")
          }
          className="pointer-cursor hover:bg-blue-200 text-lg mt-4"
          id="google-sign-in"
        >
          Sign in with{" "}
          <FcGoogle className="inline-block ml-2 bg-white" size={24} />
        </Button>
      </div>
      <Divider className="w-[75%] mt-16" />
      <div className="flex flex-row justify-between w-[75%] mt-16">
        <LandingFooter />
      </div>
    </div>
  );
};

export default UnauthenticatedLanding;
