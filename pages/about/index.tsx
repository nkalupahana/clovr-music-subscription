// About.tsx
import React, { useContext } from "react";
import { MusicContext } from "@/context/MusicContext"; // Adjust the import path accordingly
import { Button } from "@nextui-org/react";


const About: React.FC = () => {
  const context = useContext(MusicContext);
  console.log(context);
  const handlePlay = () => {
    if (context) {
      context.playSong();
    }
  };

  const handlePause = () => {
    if (context) {
      context.toggleSong();
    }
  };

  const handleRandom = () => {
    if (context) {
      context.randomSong();
    }
  }

  return (
    <div>
      <h1>About</h1>
      <button className="btn btn-primary" onClick={handlePlay}>
        Play
      </button>
      <button className="btn btn-primary" onClick={handlePause}>
        Pause
      </button>
      <Button onClick={handleRandom}>Random Song</Button>
    </div>
  );
};

export default About;
