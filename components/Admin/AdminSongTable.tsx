import React, { useState, useEffect, useContext } from "react";
import { MusicFile, ListedMusicFile } from "@/models/MusicFile";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  useDisclosure,
} from "@nextui-org/react";
import { CiCircleRemove } from "react-icons/ci";
import { MusicContext } from "@/context/MusicContext";
import ToggleAudioButton from "../icons/ToggleAudioIcon";
import TableSongCell from "../TableSongCell";
import { DeleteSongModal } from "./DeleteSongModal";
import { PlaySongTableIcon } from "../icons/PlaySongTableIcon";
import { ColumnHeaderCell } from "../ColumnHeaderCell";
import { SearchState } from "@/pages/explore";

export const AdminSongTable = ({
  filteredSongs,
  setFilteredSongs,
  searched,
}: {
  filteredSongs: any[];
  setFilteredSongs: any;
  searched: SearchState;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const context = useContext(MusicContext);
  const [musicList, setMusicList] = useState<any[]>(filteredSongs);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [songToDelete, setSongToDelete] = useState<MusicFile | null>(null);

  useEffect(() => {
    // Fix the sort of added to Db

    setMusicList(filteredSongs);
    let sortedSongs = [...filteredSongs];

    if (sortConfig.key) {
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
    setMusicList(sortedSongs);
  }, [filteredSongs, sortConfig]);

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
    <>
      <Table>
        <TableHeader>
          <TableColumn width={60}>No.</TableColumn>
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
              keyName="tempo"
              columnName="Tempo"
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
              keyName="uploadTime"
              columnName="Added to DB"
              sortConfig={sortConfig}
              requestSort={requestSort}
            />
          </TableColumn>
          <TableColumn className="text-start">
            <ColumnHeaderCell
              keyName="downloadCount"
              columnName="# Downloads"
              sortConfig={sortConfig}
              requestSort={requestSort}
            />
          </TableColumn>
          <TableColumn className="text-start">
            <ColumnHeaderCell
              keyName="delete"
              columnName=""
              sortConfig={sortConfig}
              requestSort={requestSort}
            />
          </TableColumn>
        </TableHeader>
        <TableBody items={musicList}>
          {musicList?.map((music: ListedMusicFile, index: number) => {
            return (
              <TableRow
                key={music._id}
                className={`
      hover:bg-primary hover:bg-opacity-10  
      transition-all duration-200 ease-in-out ${
        currentSong?._id === music._id ? "bg-primary bg-opacity-40" : ""
      }
      `}
              >
                <TableCell>
                  {currentSong?._id === music._id ? (
                    <span
                      className={`absolute inset-0 flex items-center justify-center cursor-pointer song-${index}`}
                    >
                      <ToggleAudioButton />
                    </span>
                  ) : (
                    <span className={`cursor-pointer song-${index}`}>
                      <PlaySongTableIcon index={index} song={music} />
                    </span>
                  )}
                </TableCell>
                <TableCell align="left">
                  <TableSongCell song={music} searched={searched} />
                </TableCell>
                <TableCell align="left">{music.tempo}</TableCell>
                <TableCell align="left">{music.releaseDate}</TableCell>
                <TableCell align="left">
                  {music.uploadTime.toString().split("T")[0]}
                </TableCell>
                <TableCell align="left">{music.downloadCount}</TableCell>
                <TableCell align="left">
                  <CiCircleRemove
                    size={32}
                    className="text-red-500 cursor-pointer "
                    onClick={() => {
                      setSongToDelete(music);
                      onOpen();
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {songToDelete && (
        <DeleteSongModal
          isOpen={isOpen}
          onClose={onClose}
          songToDelete={songToDelete}
          filteredSongs={filteredSongs}
          setFilteredSongs={setFilteredSongs}
        />
      )}
    </>
  );
};
