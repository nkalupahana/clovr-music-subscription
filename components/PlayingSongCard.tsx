import React, { useState, useRef, useEffect, useContext } from "react";
import { Card, CardBody, Image, Button, Progress } from "@nextui-org/react";
import { HeartIcon } from "./icons/HeartIcon";
import { PreviousIcon } from "./icons/PreviousIcon";
import { NextIcon } from "./icons/NextIcon";
import { ShuffleIcon } from "./icons/ShuffleIcon";
import { RepeatOneIcon } from "./icons/RepeatOneIcon";
import { PlayCircleIcon } from "./icons/PlayCircleIcon";
import { PauseCircleIcon } from "./icons/PauseCircleIcon";
import { MusicContext } from "@/context/MusicContext";
import { MusicFile } from "@/models/MusicFile";

export const PlayingSongCard = ({
  playingSong,
  handleToggle,
}: {
  playingSong?: string;
  handleToggle: (id: string) => void;
}): JSX.Element => {
  const [liked, setLiked] = useState(false);
  const [albumArt, setAlbumArt] = useState("/drake.png");
  const [songName, setSongName] = useState("Frontend Radio");
  const [songArtist, setSongArtist] = useState("Drake");
  const [songPosition, setSongPosition] = useState("1:23");
  const [songDuration, setSongDuration] = useState("4:32");
  const [songProgress, setSongProgress] = useState(66);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const context = useContext(MusicContext);

  useEffect(() => {
    if (playingSong) {
      console.log(playingSong);
    }
  }, [playingSong]);

  const handleLike = () => {
    setLiked((v) => !v);
    console.log("Liked");
  };

  const handlePrevious = () => {
    console.log("Previous");
  };

  const handleNext = () => {
    console.log("Next");
  };

  const handleShuffle = () => {
    if (context) {
      context.randomSong();
      console.log(context.getCurrentSong());
    }
  };

  const handlePlayPause = () => {
    setIsPlaying((v) => !v);
    if (context) {
      context.toggleSong();
    }
  };

  const handleProgress = () => {
    console.log(songProgress);
    console.log("Progress");
  };

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-primary "
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-6 md:col-span-4">
            <Image
              alt="Album cover"
              className="object-cover"
              height={200}
              shadow="md"
              src={albumArt}
              width="100%"
            />
          </div>

          <div className="flex flex-col col-span-6 md:col-span-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0">
                <h1 className="text-large font-medium mt-2">{songName}</h1>
                <h2 className="text-default-900/60 text-small">{songArtist}</h2>
              </div>
              <Button
                isIconOnly
                className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
                radius="full"
                variant="light"
                onPress={handleLike}
              >
                <HeartIcon
                  className={liked ? "[&>path]:stroke-transparent" : ""}
                  fill={liked ? "red" : "none"}
                  width={undefined}
                  height={undefined}
                />
              </Button>
            </div>

            <div className="flex flex-col mt-3 gap-1 ">
              <div
                ref={progressRef}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const width = rect.width;
                  const percentage = (x / width) * 100;
                  setSongProgress(percentage);
                }}
                className="relative w-full h-2 rounded-full bg-default-100/50 overflow-hidden group"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-gray-400 transition-all duration-800 ease-in-out group-hover:bg-gradient-to-r group-hover:from-yellow-500 group-hover:to-red-500"
                  style={{ width: `${songProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between">
                <p className="text-small">{songPosition}</p>
                <p className="text-small text-foreground/50">{songDuration}</p>
              </div>
            </div>

            <div className="flex w-full items-center justify-center">
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <RepeatOneIcon
                  className="text-foreground/80"
                  width={undefined}
                  height={undefined}
                />
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
                onPress={handlePrevious}
              >
                <PreviousIcon width={undefined} height={undefined} />
              </Button>
              <Button
                isIconOnly
                className="w-auto h-auto data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
                onPress={handlePlayPause}
              >
                {isPlaying ? (
                  <PauseCircleIcon
                    size={64}
                    onClick={handlePlayPause}
                    width={undefined}
                    height={undefined}
                  />
                ) : (
                  <PlayCircleIcon
                    size={64}
                    onClick={handlePlayPause}
                    width={undefined}
                    height={undefined}
                  />
                )}
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
                onPress={handleNext}
              >
                <NextIcon width={undefined} height={undefined} />
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
                onPress={handleShuffle}
              >
                <ShuffleIcon
                  className="text-foreground/80"
                  width={undefined}
                  height={undefined}
                />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
