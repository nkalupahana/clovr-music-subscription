import React, { useContext, useState, useEffect } from "react";
import { MusicContext } from "@/context/MusicContext";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { LandingSongCard } from "./LandingSongCard";
import { SongCardRow } from "./SongCardRow";
import { use } from "chai";
import { get } from "http";

export const HomePage = () => {
  const { data: session, status } = useSession();
  const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);
  const router = useRouter();
  const context = useContext(MusicContext);
  const [newReleases, setNewReleases] = useState<any>(null);
  const [mostDownloaded, setMostDownloaded] = useState<any>(null);

  const [playingSong, setPlayingSong] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const mostRecentPromise = fetch("/api/music/mostRecent?count=10").then(
        (res) => res.json()
      );
      const mostDownloadedPromise = fetch(
        "/api/music/mostDownloaded?count=10"
      ).then((res) => res.json());

      const [mostRecentData, mostDownloadedData] = await Promise.all([
        mostRecentPromise,
        mostDownloadedPromise,
      ]);

      setNewReleases(mostRecentData);
      setMostDownloaded(mostDownloadedData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-start justify-start p-4 relative">
      <div className="flex flex-row w-full justify-between ">
        <h1 className="text-3xl font-bold text-center  ">
          Welome Back, {session?.user.name.split(" ")[0].toUpperCase()}
        </h1>
        {stripeStatus?.status === "unsubscribed" && (
          <h1
            className="text-xl font-semibold cursor-pointer hover:scale-105 transition-all"
            onClick={() => {
              router.push("/pricing");
            }}
          >
            Press here to{" "}
            <span className="text-primary text-2xl font-bold">Subscribe</span>{" "}
            and start whitelisting now!
          </h1>
        )}
      </div>

      {newReleases && (
        <div className="flex flex-col ">
          <SongCardRow
            musicList={newReleases}
            playingSong={playingSong}
            setPlayingSong={setPlayingSong}
            rowTitle="Recently Added"
          />
          <SongCardRow
            musicList={mostDownloaded}
            playingSong={playingSong}
            setPlayingSong={setPlayingSong}
            rowTitle="Most Downloaded"
          />
        </div>
      )}
    </div>
  );
};
