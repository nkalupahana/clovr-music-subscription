import React, { useRef, useContext, useEffect, useState } from "react";
import { MusicContext } from "@/context/MusicContext";

const SongProgressBar: React.FC = () => {
  const progressRef = useRef<HTMLDivElement>(null);
  const context = useContext(MusicContext);
  const [songProgress, setSongProgress] = useState(0);

  useEffect(() => {
    const audioElement = context?.audio.current;

    const handleTimeUpdate = () => {
      if (audioElement) {
        const { currentTime, duration } = audioElement;
        const progressPercent = (currentTime / duration) * 100;
        setSongProgress(progressPercent);
      }
    };

    audioElement?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioElement?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [context, setSongProgress]);

  const formatSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (x / width) * 100;
    const newCurrentTime =
      (context?.audio.current?.duration || 0) * (percentage / 100);
    if (context) {
      context.setCurrentTime(newCurrentTime);
    }
  };

  return (
    <div className="progress-container">
      <div
        ref={progressRef}
        onClick={handleProgressClick}
        className="relative w-full h-2 rounded-full bg-default-100/50 overflow-hidden group"
      >
        <div
          className="absolute top-0 left-0 h-full bg-gray-400 transition-all duration-800 ease-in-out group-hover:bg-gradient-to-r group-hover:from-yellow-500 group-hover:to-red-500"
          style={{ width: `${songProgress}%` }}
        ></div>
      </div>
      <div className="flex justify-between">
        <p className="text-small">
          {formatSeconds(context?.audio.current?.currentTime || 0)}
        </p>
        <p className="text-small text-foreground/50">
          {formatSeconds(context?.getSongDuration() || 0)}
        </p>
      </div>
    </div>
  );
};

export default SongProgressBar;
