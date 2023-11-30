import React, { useState, useEffect, useRef, useContext } from "react";
import { MusicContext, MusicContextProps } from "@/context/MusicContext";
import { PlayingSongCard } from "@/components/SongCard";
import { FaSearch } from "react-icons/fa";
import { Button, Input } from "@nextui-org/react";
import SongTable from "@/components/SongTable";
import SongTableSmall from "@/components/SongTableSmall";
import VerifyAuthenticationStatus from "@/components/HigherOrderComponents/VerifyAuthenticationStatus";

export interface SearchState {
  searchString: string;
  searchField: string;
}

const Explore = () => {
  const context = useContext(MusicContext);

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Update the state based on the current window width
    const updateScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };

    // Set the initial value
    updateScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', updateScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const { musicList } = context || {};
  const [filteredSongs, setFilteredSongs] = useState<any[]>(musicList || []);
  const [search, setSearch] = useState<SearchState>({
    searchString: "",
    searchField: "",
  });
  const [showLiked, setShowLiked] = useState<boolean>(false);

  useEffect(() => {
    if (showLiked) {
      const filtered = musicList?.filter((song) =>
        context?.favoriteSongs?.some((fav) => fav.file === song._id)
      );
      setFilteredSongs(filtered || []);
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
      setSearch({
        searchString: "",
        searchField: "",
      });
      return;
    }
    const filtered = filteredSongs?.filter((song) =>
      song[field].toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSongs(filtered || []);
    setSearch({
      searchString: query,
      searchField: field,
    });
  };

  const handleShowLikedSongs = () => {
    if (showLiked) {
      setFilteredSongs(musicList || []);
      setSearch({
        searchString: "",
        searchField: "",
      });
      setShowLiked(false);
      return;
    } else {
      const filtered = musicList?.filter((song) =>
        context?.favoriteSongs?.some((fav) => fav.file === song._id)
      );
      setFilteredSongs(filtered || []);
      setSearch({
        searchString: "",
        searchField: "",
      });
      setShowLiked(true);
    }
  };

  return (
    <VerifyAuthenticationStatus>
      <div className="content-container">
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
          {isLargeScreen ? (
            <SongTable
              filteredSongs={filteredSongs}
              setFilteredSongs={setFilteredSongs}
              searched={search}
            />
          ) : (
            <SongTableSmall
              filteredSongs={filteredSongs}
              setFilteredSongs={setFilteredSongs}
              searched={search}
            />
          )}
        </div>
      </div>
    </VerifyAuthenticationStatus>
  );
};

export default Explore;
