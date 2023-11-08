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
  const context = useContext(MusicContext);
  const [isLiked, setIsLiked] = useState<any>(false);

  useEffect(() => {
    if (context) {
      setIsLiked(context.isSongLiked(song._id));
    }
  }, [context, song]);

  const toggleLike = (id: string) => {
    if (context) {
      context.toggleSongLike(song._id);
    }
  };

  return (
    <div
      className="song-heart cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
      onClick={() => {
        toggleLike(song._id);
      }}
    >
      {isLiked ? (
        <AiFillHeart size={iconSize} className="text-red-500" />
      ) : (
        <AiOutlineHeart size={iconSize} />
      )}
    </div>
  );
};

export default SongHeart;
