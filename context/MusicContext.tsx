import { set } from "mongoose";
import React, {
  useState,
  useRef,
  ReactNode,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { MusicFile } from "@/models/MusicFile";

interface MusicContextProps {
  musicList: any[]; // Replace any with the actual type of your music list
  loadMusicList: () => Promise<void>;
  playSong: (id?: string) => void;
  toggleSong: () => void;
  randomSong: () => void;
  getCurrentSong: () => MusicFile | null;
  audio: React.RefObject<HTMLAudioElement>;
}

export const MusicContext = createContext<MusicContextProps | null>(null);


interface AudioProviderProps {
  children: ReactNode;
}

const MusicProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [musicList, setMusicList] = useState<any[]>([]); // Replace any with the actual type of your music list
  const [currentSong, setCurrentSong] = useState<MusicFile | null>(null); // Add null to the type of currentSong
  const audio = useRef<HTMLAudioElement>(null);

  const loadMusicList = async () => {
    const response = await fetch("/api/music/list");
    const data = await response.json();
    setMusicList(data);
  };

  const playSong = (id?: string) => {
    if (!id) {
      return;
    }
    const song = musicList.find((music) => music._id === id);

    if (song) {
      setCurrentSong(song);
      audio.current!.src = `/api/music/play?id=${song._id}`;
      audio.current!.play();
    }
  };

  const randomSong = () => {
    const randomMusic = musicList[Math.floor(Math.random() * musicList.length)];

    if (randomMusic) {
      setCurrentSong(randomMusic);
      audio.current!.src = `/api/music/play?id=${randomMusic._id}`;
      audio.current!.play();
    }
  };

  const toggleSong = () => {
    if (audio.current?.paused) {
      audio.current?.play();
    } else {
      audio.current?.pause();
    }
  };

  useEffect(() => {
    loadMusicList();
  }, []);

  const getCurrentSong = useCallback(() => {
    return currentSong;
  }, [currentSong]);

  return (
    <MusicContext.Provider
      value={{
        musicList,
        loadMusicList,
        playSong,
        audio,
        toggleSong,
        randomSong,
        getCurrentSong,
      }}
    >
      <audio ref={audio}></audio>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
