import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { MusicFile } from "@/models/MusicFile";
import { PlayingSongCard } from "@/components/PlayingSongCard";
import {
  Skeleton,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";

import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

const Explore = () => {
  const { data: musicList } = useSWR("/api/music/list", fetcher);
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState("");

  const handleToggle = (id: string) => {
    if (playing !== id) {
      audio.current?.pause();
      audio.current!.src = `/api/music/play?id=${id}`;
      audio.current?.play();
    } else if (audio.current?.paused) {
      audio.current?.play();
    } else {
      audio.current?.pause();
    }
  };


  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <div className="flex flex-col items-center justify-center py-2 gap-2">
        <h1
          className="text-center text-6xl font-bold px-12 py-2 rounded-lg w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-gradientAnimation"
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          Explore
        </h1>
      </div>
      <PlayingSongCard playingSong={playing} handleToggle={handleToggle} />
      <div className="flex min-w-[80%] mt-4 items-center justify-center">
        <Table>
          <TableHeader>
            <TableColumn>Song Name</TableColumn>
            <TableColumn>Play</TableColumn>
            <TableColumn>Tempo</TableColumn>
            <TableColumn>Download</TableColumn>
          </TableHeader>
          <TableBody>
            {musicList?.map((music: MusicFile) => (
              <TableRow key={music._id}>
                <TableCell>{music.name}</TableCell>
                <TableCell
                  onClick={() => {
                    setPlaying(music._id);
                    handleToggle(music._id);
                  }}
                >
                  Play
                </TableCell>
                <TableCell>{music.tempo}</TableCell>
                <TableCell
                  onClick={() => {
                    window.open(`/api/music/download?id=${music._id}`);
                  }}
                  className="w-1/6 cursor-pointer"
                >
                  Download
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <audio ref={audio}></audio>
    </div>
  );
};

export default Explore;
