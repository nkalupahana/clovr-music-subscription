import React, { useContext, useState, useEffect } from "react";
import { MusicContext } from "@/context/MusicContext";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { LandingSongCard } from "./LandingSongCard";
import { Image } from "@nextui-org/react";

export const HomePage = () => {
  const { data: session, status } = useSession();
  const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);
  const router = useRouter();
  const context = useContext(MusicContext);
  const [musicList, setMusicList] = useState<any>(context?.musicList);
  const [playingSong, setPlayingSong] = useState<any>(null);

  useEffect(() => {
    setMusicList(context?.musicList);
  }, [context?.musicList]);

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
      {musicList && (
        <div className="flex flex-row w-full">
          <div className="flex flex-col items-center justify-center flex-2 overflow-x-auto ">
            <div className="flex flex-col items-start justify-center w-full">
              <h1 className="text-4xl font-bold text-center mt-8 mb-2 ">
                New Music:
              </h1>

              <div className="flex flex-row gap-4">
                {musicList.slice(0, 5).map((song: any) => {
                  return (
                    <LandingSongCard
                      playingSong={playingSong}
                      setPlayingSong={setPlayingSong}
                      song={song}
                      key={song._id}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col items-start justify-center w-full">
              <h1 className="text-4xl font-bold text-center mt-8 mb-2 ">
                New Music:
              </h1>

              <div className="flex flex-row gap-4">
                {musicList.slice(0, 5).map((song: any) => {
                  return (
                    <LandingSongCard
                      playingSong={playingSong}
                      setPlayingSong={setPlayingSong}
                      song={song}
                      key={song._id}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col items-start justify-center w-full">
              <h1 className="text-4xl font-bold text-center mt-8 mb-2 ">
                New Music:
              </h1>

              <div className="flex flex-row gap-4">
                {musicList.slice(0, 5).map((song: any) => {
                  return (
                    <LandingSongCard
                      playingSong={playingSong}
                      setPlayingSong={setPlayingSong}
                      song={song}
                      key={song._id}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-start flex-1 ">
            <Image
              src="/CLOVR_bear_1.png"
              alt="Landing page"
              className="object-cover mt-16"
              width={400}
              height={400}
            />
          </div>
        </div>
      )}
    </div>
  );
};
