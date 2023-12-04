import React, { useContext } from "react";
import { Card, CardBody, Image } from "@nextui-org/react";
import { FaPlay, FaPause } from "react-icons/fa";
import { MusicContext, MusicContextProps } from "@/context/MusicContext";
import { MusicFile } from "@/models/MusicFile";

export const LandingSongCard = ({
  song,
  playingSong,
  setPlayingSong,
}: {
  song: MusicFile;
  playingSong: MusicFile | null;
  setPlayingSong: React.Dispatch<React.SetStateAction<MusicFile | null>>;
}) => {
  const musicContext = useContext(MusicContext);

  // Type guard to ensure musicContext is not null
  if (!musicContext) {
    throw new Error("MusicContext not available");
  }

  const { isPaused, toggleSong, playSong }: MusicContextProps = musicContext;

  const handlePlayPauseClick = () => {
    if (playingSong?._id === song?._id && !isPaused) {
      setPlayingSong(null);
      toggleSong();
    } else {
      playSong(song._id);
      setPlayingSong(song);
    }
  };

  const isSongPlaying = playingSong?._id === song?._id && !isPaused;

  return (
    <Card
      isBlurred
      className={`border-none bg-background/60 dark:bg-primary mx-auto hover:scale-105 transition-all `}
      shadow="sm"
      id="playing-song-card"
    >
      <CardBody>
        <div
          className="flex flex-col items-center justify-center cursor-pointer"
          onClick={handlePlayPauseClick}
        >
          <div
            className={`relative hover-effect ${
              isSongPlaying ? "playing" : ""
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
            <div className="icon-overlay">
              {isSongPlaying ? (
                <FaPause className="text-4xl" />
              ) : (
                <FaPlay className="text-4xl" />
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-4 w-full">
            <h1 className="text-lg font-medium whitespace-nowrap overflow-ellipsis">
              {song?.name}
            </h1>
            <h2 className="text-base text-default-900/60">{song?.artist}</h2>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
