import React, { useContext, useEffect } from "react";
import { MusicContext } from "@/context/MusicContext";
import PageHeader from "./PageHeader";
import { PlayingSongCard } from "./PlayingSongCard";
import { Button } from "@nextui-org/react";

const UnauthenticatedLanding = () => {
  const context = useContext(MusicContext);
  const musicList = context?.musicList;

  return (
    <div className="flex flex-col items-center justify-start min-h-[200vh]  py-2">
      <PageHeader>Welcome to CLOVR Records</PageHeader>
      <p className="text-xl text-center">
        We are a music streaming service that allows you to upload your own
        music, and listen to music uploaded by others.
      </p>
      <Button
        className="m-2"
        onClick={() => {
          if (context) {
            context?.randomSong();
          } else {
            console.log("context is null");
          }
        }}
      >
        Listen to a song
      </Button>
      <PlayingSongCard />
    </div>
  );
};

export default UnauthenticatedLanding;
