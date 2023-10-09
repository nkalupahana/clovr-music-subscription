import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { MusicFile } from "@/models/MusicFile";
import { PlayingSongCard } from "@/components/PlayingSongCard";
import {
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

  useEffect(() => {
    console.log(playing);
  }, [playing]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <div className="flex flex-col items-center justify-center py-2 gap-2">
        <h1>
          <span className="text-5xl font-bold">Explore</span>
        </h1>
        <PlayingSongCard />
      </div>
      <div className="flex w-full">
        <Table>
          <TableHeader>
            <TableColumn>Song Name</TableColumn>
            <TableColumn>Play</TableColumn>
            <TableColumn>Tempo</TableColumn>
            <TableColumn>Download</TableColumn>
          </TableHeader>
          <TableBody>
            {musicList?.map((music: MusicFile) => (
              <TableRow key={music._id} onClick={() => {}}>
                <TableCell>{music.name}</TableCell>
                <TableCell
                  onClick={() => {
                    setPlaying(music._id);
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
