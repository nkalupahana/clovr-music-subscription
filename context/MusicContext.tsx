import { set } from "mongoose";
import React, {
  useState,
  useRef,
  ReactNode,
  createContext,
  useEffect,
  useCallback,
  use,
} from "react";
import { MusicFile } from "@/models/MusicFile";
import { getFavoriteSongs, toggleFavoriteSong } from "@/lib/Favoritehandler";

interface MusicContextProps {
  musicList: any[]; // Replace any with the actual type of your music list
  loadMusicList: () => Promise<void>;
  favoriteSongs: any[];
  loadFavoriteSongs: () => Promise<void>;
  toggleFavorite: (id: string, set: boolean) => Promise<void>;
  playSong: (id?: string) => void;
  toggleSong: () => void;
  randomSong: () => void;
  getCurrentSong: () => MusicFile | null;

  setCurrentTime: (time: number) => void;
  getSongDuration: () => number;
  nextSong: () => void;
  replaySong: () => void;
  isPaused: boolean;
  audio: React.RefObject<HTMLAudioElement>;
}

export const MusicContext = createContext<MusicContextProps | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

const MusicProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [musicList, setMusicList] = useState<any[]>([]); // Replace any with the actual type of your music list
  const [favoriteSongs, setFavoriteSongs] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<MusicFile | null>(null); // Add null to the type of currentSong
  const audio = useRef<HTMLAudioElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const loadMusicList = async () => {
    console.log("load music list");
    const response = await fetch("/api/music/list");
    const data = await response.json();
    setMusicList(data);
  };

  const loadFavoriteSongs = async () => {
    const favSongs = await getFavoriteSongs();
    setFavoriteSongs(favSongs);
  };

  const toggleFavorite = async (id: string, set: boolean) => {
    console.log("toggleLike");
    await toggleFavoriteSong(id, set);
    loadFavoriteSongs();
  };

  const setCurrentTime = (time: number) => {
    console.log("setCurrentTime");
    if (audio.current) {
      audio.current.currentTime = time;
    }
  };

  const nextSong = () => {
    console.log("nextSong");
    musicList.forEach((music, index) => {
      if (music._id === currentSong?._id) {
        const nextMusic = musicList[index + 1];
        if (nextMusic) {
          playSong(nextMusic._id);
        } else {
          playSong(musicList[0]._id);
        }
      }
    });
  };

  const replaySong = () => {
    console.log("replaySong");
    if (currentSong) {
      playSong(currentSong._id);
    }
  };

  const getSongDuration = () => {
    return audio.current?.duration || 0;
  };

  const playSong = (id?: string) => {
    console.log("playSong");
    if (!id) {
      return;
    }
    const song = musicList.find((music) => music._id === id);

    if (song) {
      setCurrentSong(song);
      audio.current!.src = `/api/music/play?id=${song._id}`;
      audio.current!.play();
      console.log(audio.current);
    }
  };

  const randomSong = () => {
    console.log("randomSong");
    const randomMusic = musicList[Math.floor(Math.random() * musicList.length)];

    if (randomMusic) {
      setCurrentSong(randomMusic);
      audio.current!.src = `/api/music/play?id=${randomMusic._id}`;
      audio.current!.play();
    }
  };

  const toggleSong = () => {
    console.log("toggleSong");
    if (audio.current?.paused) {
      audio.current?.play();
    } else {
      audio.current?.pause();
    }
  };

  useEffect(() => {
    audio.current?.addEventListener("pause", () => {
      setIsPaused(true);
    });

    audio.current?.addEventListener("play", () => {
      setIsPaused(false);
    });
  }, []);

  useEffect(() => {
    loadMusicList();
    loadFavoriteSongs();
  }, []);

  const getCurrentSong = useCallback(() => {
    console.log("getCurrentSong");
    return currentSong;
  }, [currentSong]);

  return (
    <MusicContext.Provider
      value={{
        musicList,
        loadMusicList,
        favoriteSongs,
        loadFavoriteSongs,
        toggleFavorite,
        playSong,
        audio,
        toggleSong,
        randomSong,
        getCurrentSong,
        isPaused,
        setCurrentTime,
        getSongDuration,
        nextSong,
        replaySong,
      }}
    >
      <audio ref={audio}></audio>

      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
