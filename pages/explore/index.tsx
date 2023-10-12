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
    <div className="flex flex-col items-center justify-start min-h-screen py-2 bg-red-500">
      <PageHeader>Explore</PageHeader>
      <PlayingSongCard playingSong={playing} handleToggle={handleToggle} />
      <div className="flex min-w-[80%] mt-4 items-center justify-center">
        <Table>
          <TableHeader>
            <TableColumn className="w-1/3">Song</TableColumn>
            <TableColumn>Play</TableColumn>
            <TableColumn>Tempo</TableColumn>
            <TableColumn className="w-1/12" align="center">
              {" "}
            </TableColumn>
            <TableColumn className="w-1/12" align="center">
              {" "}
            </TableColumn>
          </TableHeader>
          <TableBody
            isLoading={true}
            loadingContent={
              <TableRow>
                <TableCell colSpan={5}>
                  <Skeleton />
                </TableCell>
              </TableRow>
            }
            items={musicList}
          >
            {musicList?.map((music: MusicFile) => (
              <TableRow
                key={music._id}
                className="
              hover:bg-primary hover:bg-opacity-10  
              transition-all duration-200 ease-in-out 
              "
              >
                <TableCell>
                  <User
                    avatarProps={{
                      radius: "sm",
                      src: "/drake.png",
                    }}
                    name={music.name}
                    description={music.name}
                  >
                    {music.name}
                  </User>
                </TableCell>

                <TableCell
                  onClick={() => {
                    setPlaying(music._id);
                    handleToggle(music._id);
                  }}
                >
                  Play
                </TableCell>
                <TableCell>{music.tempo}</TableCell>
                <TableCell className="hover:scale-105 transition-all cursor-pointer ">
                  <HeartIcon
                    className={true ? "[&>path]:stroke-transparent" : ""}
                    fill={true ? "red" : "none"}
                    width={undefined}
                    height={undefined}
                  />
                </TableCell>
                <TableCell
                  onClick={() => {
                    window.open(`/api/music/download?id=${music._id}`);
                  }}
                  className="hover:scale-105 transition-all cursor-pointer "
                >
                  <FaDownload />
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
