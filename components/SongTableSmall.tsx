import React, { useState, useEffect, useRef, useContext, use } from "react";
import { useSession } from "next-auth/react";
import { MusicFile } from "@/models/MusicFile";
import {
  Skeleton,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  User,
  Tab,
} from "@nextui-org/react";
import { FaDownload, FaPlay, FaPause, FaHeart } from "react-icons/fa";
import SongHeart from "@/components/icons/SongHeart";
import { MusicContext } from "@/context/MusicContext";
import ToggleAudioButton from "./icons/ToggleAudioIcon";
import TableSongCell from "./TableSongCell";
import { handleDownload } from "@/lib/DownloadHandler";
import { PlaySongTableIcon } from "./icons/PlaySongTableIcon";
import { ColumnHeaderCell } from "./ColumnHeaderCell";
import { SearchState } from "@/pages/explore";

const SongTableSmall = ({
  filteredSongs,
  setFilteredSongs,
  searched,
}: {
  filteredSongs: any[];
  setFilteredSongs: any;
  searched: SearchState;
}) => {
  const context = useContext(MusicContext);
  const [musicList, setMusicList] = useState<any[]>(filteredSongs);
  const { data: session, status } = useSession();
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleStartSong = (id: string) => {
    if (context) {
      context.playSong(id);
    }
  };

  useEffect(() => {
    setMusicList(filteredSongs);
    let sortedSongs = [...filteredSongs];
    let favoriteSongs = context?.favoriteSongs;

    if (sortConfig.key) {
      if (sortConfig.key === "likes") {
        sortedSongs.sort((a, b) => {
          // Check if both or either of the songs are in favoriteSongs
          const aIsFavorite = favoriteSongs?.some((fav) => fav.file === a._id);
          const bIsFavorite = favoriteSongs?.some((fav) => fav.file === b._id);

          if (aIsFavorite && !bIsFavorite) {
            return -1; // a is a favorite, b is not
          }
          if (!aIsFavorite && bIsFavorite) {
            return 1; // b is a favorite, a is not
          }

          // If neither or both are favorites, sort by likes
          return b.likes - a.likes; // Assuming 'likes' is a numeric value
        });
      } else {
        sortedSongs.sort((a, b) => {
          if (sortConfig.key && a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          if (sortConfig.key && a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }

          return 0;
        });
      }
    }
    setMusicList(sortedSongs);
  }, [filteredSongs, sortConfig, context?.favoriteSongs]);

  const requestSort = (key: any) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const [currentSong, setCurrentSong] = useState<MusicFile | null>(null);
  useEffect(() => {
    if (context) {
      setCurrentSong(context?.getCurrentSong());
    }
  }, [currentSong, context]);

  return (
    <Table>
      <TableHeader>
        <TableColumn className="text-start">
          <ColumnHeaderCell
            keyName="name"
            columnName="Title"
            sortConfig={sortConfig}
            requestSort={requestSort}
          />
        </TableColumn>

        <TableColumn className="text-start">
          <ColumnHeaderCell
            keyName="releaseDate"
            columnName="Release Date"
            sortConfig={sortConfig}
            requestSort={requestSort}
          />
        </TableColumn>
        <TableColumn className="text-start">
          <ColumnHeaderCell
            keyName="likes"
            columnName="Likes"
            sortConfig={sortConfig}
            requestSort={requestSort}
          />
        </TableColumn>
      </TableHeader>
      <TableBody items={musicList}>
        {musicList?.map((music: MusicFile, index: number) => {
          return (
            <TableRow
              key={music._id}
              className={`
        hover:bg-primary hover:bg-opacity-10  
        transition-all duration-200 ease-in-out ${
          currentSong?._id === music._id ? "bg-primary bg-opacity-40" : ""
        }
        `}
              onClick={() => {
                handleStartSong(music._id);
              }}
            >
              <TableCell align="left">
                <TableSongCell song={music} searched={searched} />
              </TableCell>
              <TableCell align="left">{music.releaseDate}</TableCell>
              <TableCell align="left">
                <SongHeart song={music} iconSize={24} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SongTableSmall;
