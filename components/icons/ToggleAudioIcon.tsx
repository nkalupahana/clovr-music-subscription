import React, { useContext } from "react";
import { MusicContext } from "@/context/MusicContext";
import { FaPlay, FaPause } from "react-icons/fa";

const ToggleAudioButton = ({
  // props
  iconSize = 20,
}) => {
  const context = useContext(MusicContext);

  const handleToggle = () => {
    if (context) {
      context.toggleSong();
    }
  };

  return (
    <div className="toggle-audio-button cursor-pointer hover:scale-105 hover:text-foreground/50 transition-all ease-in-out duration-200" onClick={handleToggle}>
      {context?.isPaused ? <FaPlay size={iconSize} /> : <FaPause size={iconSize} />}
    </div>
  );
};

export default ToggleAudioButton;
