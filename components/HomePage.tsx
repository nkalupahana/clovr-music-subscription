import React, { useContext, useState, useEffect } from "react";
import { MusicContext } from "@/context/MusicContext";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { LandingFooter } from "./LandingFooter";
import { SongCardRow } from "./SongCardRow";
import { Image, CircularProgress } from "@nextui-org/react";

export const HomePage = () => {
  const { data: session, status } = useSession();
  const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);
  const router = useRouter();
  const context = useContext(MusicContext);
  const [newReleases, setNewReleases] = useState<any>(null);
  const [mostDownloaded, setMostDownloaded] = useState<any>(null);
  const [playingSong, setPlayingSong] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBigScreen, setIsBigScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsBigScreen(false);
      } else {
        setIsBigScreen(true);
      }
    };

    // Set the initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div className="flex flex-col w-full gap-4 relative">
      {stripeStatus?.status === "unsubscribed" && isBigScreen && (
        <h1
          className=" text-sm md:text-xl font-semibold cursor-pointer hover:scale-105 transition-all absolute top-4 right-4"
          onClick={() => {
            router.push("/pricing");
          }}
        >
          Press here to{" "}
          <span className="text-primary text-2xl font-bold">Subscribe</span> and
          start whitelisting now!
        </h1>
      )}
      <div className="flex flex-row w-full ">
        <div className="flex flex-col items-start justify-start p-4 ">
          <div className="flex flex-row w-full justify-between ">
            <h1 className="text-3xl font-bold text-center  ">
              Welome Back, {session?.user.name.split(" ")[0].toUpperCase()}
            </h1>
          </div>
          {!newReleases && !mostDownloaded ? (
            <div className="flex flex-col items-center justify-center p-4 relative">
              <CircularProgress color="primary" />
            </div>
          ) : (
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
        {isBigScreen && newReleases && (
          <div className="flex flex-col items-center justify-center p-4 relative">
            <Image src="CLOVR_bear_1.png" alt="CLOVR" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center p-4 relative">
        <LandingFooter />
      </div>
    </div>
  );
};
