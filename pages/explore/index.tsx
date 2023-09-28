import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { MusicFile } from "@/models/MusicFile";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const Explore = () => {
  const { data: musicList } = useSWR("/api/music/list", fetcher);
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState("");
  useEffect(() => {
    console.log(musicList);
  }, [musicList]);

  const toggleAudio = (music: MusicFile) => {
    const audioPlayer = audio.current!;
    if (audioPlayer.paused) {
      audioPlayer.src = `/api/music/play?id=${music._id}`;
      audioPlayer.play();
      setPlaying(audioPlayer.src.split("=")[1]);
    } else {
      audioPlayer.pause();
      setPlaying("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <div className="flex flex-col items-center justify-center py-2">
        <h1>
          <span className="text-5xl font-bold">Explore</span>
        </h1>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>Song Name</TableColumn>
          <TableColumn>Tempo</TableColumn>
          <TableColumn>Play</TableColumn>
          <TableColumn>Download</TableColumn>
        </TableHeader>
        <TableBody>
          {musicList?.map((music: MusicFile) => (
            <TableRow key={music._id}>
              <TableCell>{music.name}</TableCell>
              <TableCell>{music.tempo}</TableCell>
              <TableCell
                onClick={() => {
                  toggleAudio(music);
                }}
                className="w-1/6 cursor-pointer" 
              >
                {playing === music._id ? "Pause" : "Play"}
              </TableCell>
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
      <audio ref={audio}></audio>
    </div>
  );
};

export default Explore;
