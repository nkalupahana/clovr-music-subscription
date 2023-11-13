import React, { useContext } from "react";
import { FaPlay } from "react-icons/fa";
import { MusicFile } from "@/models/MusicFile";
import { MusicContext } from "@/context/MusicContext";

export const PlaySongTableIcon = ({
  index,
  song,
}: {
  index: number;
  song: MusicFile;
}) => {
  const context = useContext(MusicContext);
  const handleStartSong = (id: string) => {
    if (context) {
      context.playSong(id);
    }
  };
  return (
    <div className="relative group cursor-pointer">
      <span className="absolute inset-0 flex items-center justify-center group-hover:hidden">
        {index + 1}
      </span>
      <span className="absolute inset-0  items-center justify-center hidden group-hover:flex">
        <FaPlay id={`play-song`}  size={20} onClick={() => handleStartSong(song._id)} />
      </span>
    </div>
  );
};
