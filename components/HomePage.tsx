import React, { useEffect, useState } from "react";
import { MusicContext } from "@/context/MusicContext";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { useSession } from "next-auth/react";
import { LandingFooter } from "./LandingFooter";
import { SongCardRow } from "./SongCardRow";
import { Image, CircularProgress, Link } from "@nextui-org/react";

export const HomePage = () => {
  const { data: session, status } = useSession();
  const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);
  const { data: newReleases, error: mostRecentError } = useSWR(
    session ? "/api/music/mostRecent?count=10" : null,
    fetcher
  );
  const { data: mostDownloaded, error: mostDownloadedError } = useSWR(
    session ? "/api/music/mostDownloaded?count=10" : null,
    fetcher
  );

  const [playingSong, setPlayingSong] = useState<any>(null);
  const [isBigScreen, setIsBigScreen] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 768) {
      setIsBigScreen(true);
    } else {
      setIsBigScreen(false);
    }
  }, []);

  if (!newReleases && !mostDownloaded) {
    return (
      <div className="content-container">
        <div className="flex flex-col items-center justify-center p-4 relative">
          <CircularProgress color="primary" />
        </div>
      </div>
    );
  }

  if (mostRecentError || mostDownloadedError) {
    return <div>Error loading data</div>; // Or any error component
  }

  return (
    <div className="flex flex-col w-full gap-4 relative drop-in">
      {stripeStatus?.status === "unsubscribed" && isBigScreen && (
        <Link href="/subscriptions">
          <h1 className=" text-sm md:text-xl font-semibold cursor-pointer hover:scale-105 transition-all absolute top-4 right-4">
            Press here to{" "}
            <span className="text-primary text-2xl font-bold">Subscribe</span>{" "}
            and start whitelisting now!
          </h1>
        </Link>
      )}
      <div className="flex flex-row md:w-[90%] mx-auto ">
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
        {isBigScreen && (
          <div className="flex flex-grow flex-row items-center justify-center p-4 ">
            <Image src="DJ_Bear.png" alt="CLOVR" height={500} width={500} />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center p-4 relative">
        <LandingFooter />
      </div>
    </div>
  );
};
