import React, { useRef, useContext, useEffect, useState } from "react";
import { MusicContext } from "@/context/MusicContext";

const SongProgressBar: React.FC = () => {
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const context = useContext(MusicContext);
  const [songProgress, setSongProgress] = useState(0);
  const circleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const audioElement = context?.audio.current;

    const handleTimeUpdate = () => {
      if (audioElement && !isDragging) {
        const { currentTime, duration } = audioElement;
        const progressPercent = (currentTime / duration) * 100;
        setSongProgress(progressPercent);
      }
    };

    audioElement?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioElement?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [context, setSongProgress, isDragging]);

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

  // Add mouse down event to the circle
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.stopPropagation(); // Prevent other elements from triggering
  };

  // Add mouse move event to the window to allow dragging outside the bar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && progressContainerRef.current) {
        const rect = progressContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // Get mouse position relative to progress bar
        const width = rect.width;
        const progressPercent = Math.max(0, Math.min(1, x / width)) * 100;
        setSongProgress(progressPercent);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging]);

  // Add mouse up event to the window to release the drag
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (context?.audio.current) {
          const newTime =
            (context.audio.current.duration || 0) * (songProgress / 100);
          context.audio.current.currentTime = newTime; // Set the audio element's current time
        }
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, songProgress, context]);

  return (
    <div className="progress-container" ref={progressContainerRef}>
      <div
        ref={progressRef}
        onClick={handleProgressClick}
        className="relative w-full h-2 bg-default-200/50  group"
      >
        <div
          className={`absolute top-0 left-0 h-full bg-gray-400 ${
            isDragging ? "bg-gradient-to-r from-yellow-500 to-red-500" : ""
          } `}
          style={{ width: `${songProgress}%` }}
        ></div>
        <div
          ref={circleRef}
          onMouseDown={handleMouseDown}
          className="absolute"
          style={{
            left: `${songProgress}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            cursor: "pointer", // Indicates the element is draggable
          }}
        >
          <div
            className="w-5 h-5 bg-white rounded-full shadow"
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          ></div>

        </div>
      </div>
      <div className="flex justify-between mt-2">
        <p className="text-small">
          {isDragging
            ? formatSeconds(
                (context?.audio.current?.duration || 0) * (songProgress / 100)
              )
            : formatSeconds(context?.audio.current?.currentTime || 0)}
        </p>
        <p className="text-small ">
          {formatSeconds(context?.getSongDuration() || 0)}
        </p>
      </div>
    </div>
  );
};

export default SongProgressBar;
