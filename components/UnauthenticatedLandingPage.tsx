import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { MusicContext } from "@/context/MusicContext";
import { Button, Divider } from "@nextui-org/react";
import { LandingSongCard } from "./LandingSongCard";
import { PricingCard } from "./PricingCard";
import { LandingFooter } from "./LandingFooter";
import { SignInWithGoogle } from "./SignInWithGoogle";
import { PricingInformation } from "./PricingInformation";

const UnauthenticatedLanding = () => {
  const context = useContext(MusicContext);
  const router = useRouter();
  const musicList = context?.musicList;
  const [playingSong, setPlayingSong] = useState<any>(null);
  const [displayedSongs, setDisplayedSongs] = useState<any>([]);

  useEffect(() => {
    // Set the number of songs to display based on the screen width
    const updateDisplayedSongs = () => {
      const screenWidth = window.innerWidth;
      const maxSongs = screenWidth >= 768 ? 8 : 4; // 768px as a breakpoint
      setDisplayedSongs(musicList?.slice(0, maxSongs));
    };

    // Call the function on mount
    updateDisplayedSongs();

    // Optionally, add a resize event listener if dynamic resizing is needed
    // window.addEventListener('resize', updateDisplayedSongs);

    // Clean up the event listener
    // return () => window.removeEventListener('resize', updateDisplayedSongs);
  }, [musicList]); // Empty dependency array to ensure it runs once at mount

  return (
    <div className="flex flex-col items-center justify-start py-2">
      <div className="flex flex-col items-center justify-center ">
        <div className="flex flex-col items-center justify-center gap-4 md:w-[70%]">
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            Royalty Free <span className="text-primary">Music</span> For Your
            Content
          </h1>
          <h2 className="text-xl md:text-3xl text-wrap text-gray-400 text-center mt-16">
            Get unlimited access to our music and sound effects catalog for your
            videos, streams and podcasts. Our license comes with all necessary
            rights included.
          </h2>
        </div>
        <div className="flex flex-row items-center mt-12 gap-4">
          <SignInWithGoogle />
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
        <Divider className="mt-16" />
        <h1 className="text-4xl font-bold text-center mt-16">
          Checkout Some of Our Music
        </h1>
        <div className="grid-container mt-8 ">
          {displayedSongs.map((song: any, index: number) => (
            <LandingSongCard
              key={index}
              playingSong={playingSong}
              setPlayingSong={setPlayingSong}
              song={song}
            />
          ))}
        </div>
        <Divider className=" mt-16" />
        <PricingInformation />

        <Divider className=" mt-16" />
        <h2 className="text-xl text-gray-400 text-center mt-8 mb-2">
          Ready to get started? Sign in with Google to subscribe and explore!
        </h2>
        <SignInWithGoogle />
        <Divider className=" mt-16" />

        <LandingFooter />
      </div>
    </div>
  );
};

export default UnauthenticatedLanding;
