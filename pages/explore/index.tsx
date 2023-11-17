import React, { useState, useEffect, useRef, useContext } from "react";
import { MusicContext } from "@/context/MusicContext";
import { PlayingSongCard } from "@/components/PlayingSongCard";
import { FaSearch } from "react-icons/fa";
import { Button, Input } from "@nextui-org/react";
import SongTable from "@/components/SongTable";
import PageHeader from "@/components/PageHeader";
import VerifyAuthenticationStatus from "@/components/HigherOrderComponents/VerifyAuthenticationStatus";

const Explore = () => {
  const audio = useRef<HTMLAudioElement>(null);
  const context = useContext(MusicContext);
  const { musicList } = context || {};
  const [filteredSongs, setFilteredSongs] = useState<any[]>(musicList || []);
  const [search, setSearch] = useState<string>("");
  const [showLiked, setShowLiked] = useState<boolean>(false);

  useEffect(() => {
    if (showLiked) {
      const filtered = musicList?.filter((song) =>
        context?.favoriteSongs?.some((fav) => fav.file === song._id)
      );
      setFilteredSongs(filtered || []);
      setSearch("true");
    }
  }, [context?.favoriteSongs, showLiked, musicList]);

  useEffect(() => {
    setFilteredSongs(musicList || []);
  }, [musicList]);

  const handleSearch = (query: string, field: string) => {
    if (query === "") {
      if (showLiked) {
        const filtered = musicList?.filter((song) =>
          context?.favoriteSongs?.some((fav) => fav.file === song._id)
        );
        setFilteredSongs(filtered || []);
      } else {
        setFilteredSongs(musicList || []);
      }
      setSearch("");
      return;
    }
    const filtered = filteredSongs?.filter((song) =>
      song[field].toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSongs(filtered || []);
    setSearch(query);
  };

  const handleShowLikedSongs = () => {
    if (showLiked) {
      setFilteredSongs(musicList || []);
      setSearch("");
      setShowLiked(false);
      return;
    } else {
      const filtered = musicList?.filter((song) =>
        context?.favoriteSongs?.some((fav) => fav.file === song._id)
      );
      setFilteredSongs(filtered || []);
      setSearch("true");
      setShowLiked(true);
    }
  };

  return (
    <VerifyAuthenticationStatus>
      <div className="flex flex-col items-center justify-start min-h-[200vh]  py-2">
        <PageHeader>Explore</PageHeader>

        <PlayingSongCard />
        <Button
          className="mt-4"
          color={showLiked ? "secondary" : "primary"}
          onClick={() => handleShowLikedSongs()}
        >
          {showLiked ? "Show All Songs" : "Show Liked Songs"}
        </Button>
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
            onChange={(e) => handleSearch(e.target.value, "artist")} //switch to aritst name when available
            isClearable
          />
        </div>

        <div className="flex min-w-[80%] mt-4 items-center justify-center overflow-y-auto">
          <SongTable
            filteredSongs={filteredSongs}
            setFilteredSongs={setFilteredSongs}
            searched={search}
          />
        </div>
        <audio ref={audio}></audio>
      </div>
    </VerifyAuthenticationStatus>
  );
};

export default Explore;
