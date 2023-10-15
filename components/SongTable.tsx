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
import ToggleAudioButton from "./ToggleAudioButton";
import TableSongCell from "./TableSongCell";

const SongTable = ({
  filteredSongs,
  searched,
}: {
  filteredSongs: any[];
  searched: string;
}) => {
  const context = useContext(MusicContext);
  const [musicList, setMusicList] = useState<any[]>(filteredSongs);
  const { data: session, status } = useSession();

  const handleStartSong = (id: string) => {
    if (context) {
      context.playSong(id);
    }
  };

  const handleToggle = () => {
    if (context) {
      context.toggleSong();
    }
  };

  const handleDownload = (id: string) => {
    window.open(`/api/music/download?id=${id}`);
  };

  useEffect(() => {
    setMusicList(filteredSongs);
  }, [filteredSongs]);

  return (
    <Table>
      <TableHeader>
        <TableColumn width={60}>No.</TableColumn>
        <TableColumn className="text-start">Song</TableColumn>
        <TableColumn className="text-start">Tempo</TableColumn>
        <TableColumn className="text-start"> </TableColumn>
        <TableColumn className="text-start"> </TableColumn>
      </TableHeader>
      <TableBody>
        {musicList?.map((music: MusicFile, index: number) => (
          <TableRow
            key={music._id}
            className={`
        hover:bg-primary hover:bg-opacity-10  
        transition-all duration-200 ease-in-out ${
          context?.getCurrentSong()?._id === music._id
            ? "bg-primary bg-opacity-40"
            : ""
        }
        `}
          >
            <TableCell>
              {context?.getCurrentSong()?._id === music._id ? (
                <span className="absolute inset-0 flex items-center justify-center cursor-pointer ">
                  <ToggleAudioButton />
                </span>
              ) : (
                <div className="relative group cursor-pointer">
                  <span className="absolute inset-0 flex items-center justify-center group-hover:hidden">
                    {index + 1}
                  </span>
                  <span className="absolute inset-0  items-center justify-center hidden group-hover:flex">
                    <FaPlay
                      size={20}
                      onClick={() => handleStartSong(music._id)}
                    />
                  </span>
                </div>
              )}
            </TableCell>
            <TableCell align="left">
              <TableSongCell song={music} searched={searched} />
            </TableCell>
            <TableCell align="left">{music.tempo}</TableCell>
            <TableCell align="left">
              <SongHeart song={music} iconSize={24} />
            </TableCell>
            <TableCell align="left">
              {session?.user?.subscribed && (
                <FaDownload
                  className="cursor-pointer"
                  size={20}
                  onClick={() => handleDownload(music._id)}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SongTable;
