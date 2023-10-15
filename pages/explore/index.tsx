import React, { useState, useEffect, useRef, useContext } from "react";
import { MusicContext } from "@/context/MusicContext";
import { PlayingSongCard } from "@/components/PlayingSongCard";
import { FaSearch } from "react-icons/fa";
import { Input } from "@nextui-org/react";
import SongTable from "@/components/SongTable";
import PageHeader from "@/components/PageHeader";

const Explore = () => {
  const audio = useRef<HTMLAudioElement>(null);
  const context = useContext(MusicContext);
  const [filteredSongs, setFilteredSongs] = useState<any[]>(
    context?.musicList || []
  );
  useEffect(() => {
    console.log(filteredSongs);
  }, [filteredSongs]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <PageHeader>Explore</PageHeader>
      <PlayingSongCard />
      <div className="flex flex-row items-start min-w-[80%] mt-4 gap-2 ">
        <Input
          size="md"
          placeholder="Search for songs..."
          startContent={<FaSearch className="text-gray-400" />}
          onChange={(e) => {
            const filtered = context?.musicList.filter((song) =>
              song.name.toLowerCase().startsWith(e.target.value.toLowerCase())
            );
            setFilteredSongs(filtered || []);
          }}
          isClearable
        />
        <Input
          size="md"
          placeholder="Search for artist..."
          startContent={<FaSearch className="text-gray-400" />}
          onChange={(e) => {
            const filtered = context?.musicList.filter((song) =>
              song.name.toLowerCase().startsWith(e.target.value.toLowerCase())
            );
            setFilteredSongs(filtered || []);
          }}
          isClearable
        />
      </div>

      <div className="flex min-w-[80%] mt-4 items-center justify-center">
        <SongTable filteredSongs={filteredSongs} />
      </div>
      <audio ref={audio}></audio>
    </div>
  );
};

export default Explore;
