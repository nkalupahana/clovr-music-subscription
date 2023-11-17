import React, { useState, useEffect, useContext } from "react";
import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";
import { BsShuffle } from "react-icons/bs";
import { Card, CardBody, Image, Button } from "@nextui-org/react";
import SongHeart from "./icons/SongHeart";
import SongProgressBar from "./SongProgressBar";
import ToggleAudioButton from "./ToggleAudioButton";
import { MusicContext } from "@/context/MusicContext";
import TableSongCell from "./TableSongCell";

export const StickyBottomMusicPlayer = () => {
  const [songProgress, setSongProgress] = useState(0);
  const [playingSong, setPlayingSong] = useState<any>(null);

  const context = useContext(MusicContext);

  useEffect(() => {
    if (context) {
      setPlayingSong(context.getCurrentSong());
    }
  }, [context]);

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
    }
  };
  return (
    <>
      {playingSong && (
        <div
          className="sticky bottom-0 w-full h-28 bg-black z-50 flex flex-row rounded-none"
          id="bottom-music-player"
        >
          <div className="flex flex-grow justify-start px-2 gap-4 items-center w-1/3">
            <TableSongCell
              song={playingSong}
              searched={{
                searchString: "",
                searchField: "",
              }}
            />
            <SongHeart song={playingSong} iconSize={32} />
          </div>
          <div className="flex flex-grow justify-center items-center flex-col w-1/3">
            <div className="flex w-full items-center justify-center gap-4 mb-2">
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
            <div className="w-full">
              <SongProgressBar />
            </div>
          </div>
          <div className="flex flex-grow justify-center items-center w-1/3"></div>
        </div>
      )}
    </>
  );
};
