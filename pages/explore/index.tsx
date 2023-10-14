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
  User,
} from "@nextui-org/react";
import { HeartIcon } from "@/components/icons/HeartIcon";
import { FaDownload } from "react-icons/fa";
import SongTable from "@/components/SongTable";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import PageHeader from "@/components/PageHeader";

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
    <div className="flex flex-col items-center justify-start min-h-screen py-2 ">
      <PageHeader>Explore</PageHeader>
      <PlayingSongCard playingSong={playing} handleToggle={handleToggle} />
      <div className="flex min-w-[80%] mt-4 items-center justify-center">
        <SongTable />
      </div>
      <audio ref={audio}></audio>
    </div>
  );
};

export default Explore;
