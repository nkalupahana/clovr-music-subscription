import { useEffect, useState, useContext } from "react";
import { Button, useDisclosure, Chip, Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { z } from "zod";
import { addSongToDb } from "@/lib/AddSongToDb";
import { AddSongToDbModal } from "./AddSongToDbModal";
import { MusicContext } from "@/context/MusicContext";
import { AdminSongTable } from "./AdminSongTable";
import { SearchState } from "@/pages/explore";


export const AdminMusicDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const context = useContext(MusicContext);
  const { musicList } = context || {};
  const [filteredSongs, setFilteredSongs] = useState<any[]>(musicList || []);
  const [search, setSearch] = useState<SearchState>({
    searchString: "",
    searchField: "",
  });

  useEffect(() => {
    setFilteredSongs(musicList || []);
  }, [musicList]);

  const handleSearch = (query: string, field: string) => {
    if (query === "") {
      setFilteredSongs(musicList || []);
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
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-row justify-start items-center px-32">
        <Button
          className="hover:scale-105 transition-all duration-200"
          color="secondary"
          onPress={onOpen}
        >
          + Add Song
        </Button>
        {success && (
          <Chip className="ml-8" color="success" onClose={() => setSuccess("")}>
            {success}
          </Chip>
        )}
        <AddSongToDbModal
          isOpen={isOpen}
          onClose={onClose}
          error={error}
          setError={setError}
          setSuccess={setSuccess}
        />
      </div>
      <div className="flex flex-col items-center justify-center w-[80%] mx-auto mt-8">
        <div className="flex flex-row items-start w-full mb-8 gap-2">
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
        <AdminSongTable
          filteredSongs={filteredSongs}
          setFilteredSongs={setFilteredSongs}
          searched={search}
        />
      </div>
    </div>
  );
};
