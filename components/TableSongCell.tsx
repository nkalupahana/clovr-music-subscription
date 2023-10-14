import React from "react";
import { User } from "@nextui-org/react";
import { MusicFile } from "@/models/MusicFile";

const TableSongCell = ({ song }: { song: MusicFile }) => {
  return (
    <User
      avatarProps={{
        src: "/drake.png", // switch to album cover when available
        radius: "sm",
        size: "lg",
      }}
      name={
        <span className="text-lg text-primary-500 font-semibold">
          {song.name}
        </span>
      }
      description={
        <span className="text-sm text-secondary-500">{song.name}</span> // switch to artist name when available
      }
    />
  );
};

export default TableSongCell;
