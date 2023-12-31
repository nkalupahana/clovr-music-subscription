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

  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    if (window.innerWidth > 768) {
      setIsLargeScreen(true);
    } else {
      setIsLargeScreen(false);
    }
  }, []);

  const { musicList } = context || {};
  const [filteredSongs, setFilteredSongs] = useState<any[]>(musicList || []);
  const [search, setSearch] = useState<SearchState>({
    searchString: "",
    searchField: "",
  });
  const [showLiked, setShowLiked] = useState<boolean>(false);
  const [searchSong, setSearchSong] = useState<string>("");
  const [searchArtist, setSearchArtist] = useState<string>("");

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
      <div className="content-container drop-in">
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
            value={searchSong}
            startContent={<FaSearch className="text-gray-400" />}
            onChange={(e) => {
              handleSearch(e.target.value, "name");
              setSearchSong(e.target.value);
            }}
            onClear={() => {
              handleSearch("", "");
              setSearchSong("");
            }}
            isClearable
          />
          <Input
            size="md"
            placeholder="Search for artist..."
            startContent={<FaSearch className="text-gray-400" />}
            value={searchArtist}
            onChange={(e) => {
              handleSearch(e.target.value, "artist");
              setSearchArtist(e.target.value);
            }}
            onClear={() => {
              handleSearch("", "");
              setSearchArtist("");
            }}
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
