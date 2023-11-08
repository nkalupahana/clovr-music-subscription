import React, { useContext, useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MusicFile } from "@/models/MusicFile";
import { MusicContext } from "@/context/MusicContext";

const SongHeart = ({
  song,
  iconSize = 20,
}: {
  song: MusicFile;
  iconSize: number;
}) => {
  const [isFavorite, setIsFavorite] = useState<any>(false);
  const context = useContext(MusicContext);

  useEffect(() => {
    if (context) {
      const favSongs = context.favoriteSongs;
      const isFavorite = favSongs.some((favSong) => {
        return favSong.file === song._id;
      });
      setIsFavorite(isFavorite);
    }
  }, [context, song]);

  const toggleLike = async (id: string) => {
    if (isFavorite) {
      context?.toggleFavorite(id, false);
    } else {
      context?.toggleFavorite(id, true);
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className="song-heart cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
      onClick={() => {
        toggleLike(song._id);
      }}
    >
      {isFavorite ? (
        <AiFillHeart size={iconSize} className="text-red-500" />
      ) : (
        <AiOutlineHeart size={iconSize} />
      )}
    </div>
  );
};

export default SongHeart;
