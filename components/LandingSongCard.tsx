import React, { useState, useEffect, useContext } from "react";
import { Card, CardBody, Image, Button } from "@nextui-org/react";
import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";
import { BsShuffle } from "react-icons/bs";
import { MusicContext } from "@/context/MusicContext";
import SongHeart from "./icons/SongHeart";
import SongProgressBar from "./SongProgressBar";
import ToggleAudioButton from "./ToggleAudioButton";
import { MusicFile } from "@/models/MusicFile";
import { FaPlay, FaPause } from "react-icons/fa";
import { set } from "cypress/types/lodash";

export const LandingSongCard = ({
  song,
  playingSong,
  setPlayingSong,
}: {
  song: MusicFile;
  playingSong: MusicFile | null;
  setPlayingSong: React.Dispatch<React.SetStateAction<MusicFile | null>>;
}) => {
  const context = useContext(MusicContext);

  useEffect(() => {
    console.log("song", playingSong);
  }, [playingSong]);

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-primary drop-in w-[50%] mx-auto"
      shadow="sm"
      id="playing-song-card"
    >
      <CardBody>
        <div
          className="flex flex-col items-center justify-center"
          onClick={() => {
            setPlayingSong(song);
          }}
        >
          <div>
            <div
              className={`relative hover-effect ${
                playingSong?._id === song?._id ? "playing" : ""
              }`}
            >
              <Image
                alt="Album cover"
                className="object-cover darken-image"
                height={200}
                shadow="md"
                src={`${process.env.NEXT_PUBLIC_CDN_URL}${song?.albumArtKey}`}
                width={200}
              />
              {playingSong?._id === song?._id ? (
                <div
                  className="icon-overlay"
                  onClick={() => {
                    setPlayingSong(null);
                    context?.toggleSong();
                  }}
                >
                  <FaPause className="text-4xl" />
                </div>
              ) : (
                <div
                  className="icon-overlay"
                  onClick={() => {
                    context?.playSong(song._id);
                    setPlayingSong(song);
                  }}
                >
                  <FaPlay className="text-4xl" />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-between mt-4">
            <h1 className="text-2xl font-medium">{song?.name}</h1>
            <h2 className="text-default-900/60 text-small">{song?.artist}</h2>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
