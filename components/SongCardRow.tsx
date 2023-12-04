import React, { useContext, useState, useEffect } from "react";

import { LandingSongCard } from "./LandingSongCard";

export const SongCardRow = ({
  musicList,
  playingSong,
  setPlayingSong,
  rowTitle
}: {
  musicList: any;
  playingSong: any;
  setPlayingSong: any;
    rowTitle: string;
}) => {
  const [numCols, setNumCols] = useState<number>(5); // Default to 5

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setNumCols(3);
      } else {
        setNumCols(7);
      }
    };

    // Set the initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl md:text-4xl font-bold text-start my-4">{rowTitle}:</h1>
      <div className="flex flex-row gap-2 items-center justify-center">
        {musicList?.slice(0, numCols).map((song: any) => (
          <LandingSongCard
            key={song._id}
            song={song}
            playingSong={playingSong}
            setPlayingSong={setPlayingSong}
          />
        ))}
      </div>
    </div>
  );
};
