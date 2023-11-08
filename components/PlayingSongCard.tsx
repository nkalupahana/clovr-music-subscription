import React, { useState, useRef, useEffect, useContext } from "react";
import { Card, CardBody, Image, Button } from "@nextui-org/react";
import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";
import { BsShuffle } from "react-icons/bs";
import { MusicContext } from "@/context/MusicContext";
import SongHeart from "./icons/SongHeart";
import SongProgressBar from "./SongProgressBar";
import ToggleAudioButton from "./ToggleAudioButton";

export const PlayingSongCard = () => {
  const [songProgress, setSongProgress] = useState(0);
  const context = useContext(MusicContext);
  const playingSong = context?.getCurrentSong();

  useEffect(() => {
    const audioElement = context?.audio.current;

    const handleTimeUpdate = () => {
      if (audioElement) {
        const { currentTime, duration } = audioElement;
        const progressPercent = (currentTime / duration) * 100;
        setSongProgress(progressPercent);
      }
    };

    audioElement?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioElement?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [context, setSongProgress]);

  useEffect(() => {
    if (playingSong) {
      console.log(playingSong);
    }
  }, [playingSong]);

  const handleReplay = () => {
    if (context) {
      context.replaySong();
    }
  };

  const handleNext = () => {
    if (context) {
      context.nextSong();
    }
  };

  const handleShuffle = () => {
    if (context) {
      context.randomSong();
      console.log(context.getCurrentSong());
    }
  };

  return (
    <>
      {playingSong && (
        <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-primary drop-in"
          shadow="sm"
        >
          <CardBody>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center ">
              <div className="relative col-span-6 md:col-span-4">
                <Image
                  alt="Album cover"
                  className="object-cover"
                  height={200}
                  shadow="md"
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}${playingSong?.albumArtKey}`}
                  width={200}
                />
              </div>

              <div className="flex flex-col col-span-6 md:col-span-8">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-0">
                    <h1 className="text-2xl font-medium mt-2">
                      {playingSong?.name}
                    </h1>
                    <h2 className="text-default-900/60 text-small">
                      {playingSong?.artist}
                    </h2>
                  </div>
                  <SongHeart song={playingSong} iconSize={32} />
                </div>

                <div className="flex flex-col mt-3 gap-1 ">
                  <SongProgressBar />
                </div>

                <div className="flex w-full items-center justify-center gap-4">
                  <BiSkipPrevious
                    className="text-foreground hover:text-foreground/50 transition-all ease-in-out duration-200 cursor-pointer"
                    size={42}
                    onClick={handleReplay}
                  />
                  <ToggleAudioButton iconSize={28} />
                  <BiSkipNext
                    className="text-foreground hover:text-foreground/50 transition-all ease-in-out duration-200 cursor-pointer"
                    size={42}
                    onClick={handleNext}
                  />
                  <BsShuffle
                    className="text-foreground hover:text-foreground/50 transition-all ease-in-out duration-200 cursor-pointer"
                    size={28}
                    onClick={handleShuffle}
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};
