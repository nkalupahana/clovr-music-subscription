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
  const { musicList } = context || {};
  const [filteredSongs, setFilteredSongs] = useState<any[]>(musicList || []);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setFilteredSongs(musicList || []);
  }, [musicList]);

  const handleSearch = (query: string, field: string) => {
    const filtered = musicList?.filter((song) =>
      song[field].toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSongs(filtered || []);
    setSearch(query);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[200vh]  py-2">
      <PageHeader>Explore</PageHeader>
      <PlayingSongCard />
      <div className="flex flex-row items-start min-w-[80%] mt-4 gap-2">
        <Input
          size="md"
          placeholder="Search for songs..."
          startContent={<FaSearch className="text-gray-400" />}
          onChange={(e) => handleSearch(e.target.value, "name")}
          isClearable
        />
        <Input
          size="md"
          placeholder="Search for artist..."
          startContent={<FaSearch className="text-gray-400" />}
          onChange={(e) => handleSearch(e.target.value, "name")} //switch to aritst name when available
          isClearable
        />
      </div>
      <div className="flex min-w-[80%] mt-4 items-center justify-center overflow-y-auto">
        <SongTable filteredSongs={filteredSongs} searched={search} />
      </div>
      <audio ref={audio}></audio>
    </div>
  );
};

export default Explore;
