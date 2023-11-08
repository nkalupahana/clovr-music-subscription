import React, { useContext, useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MusicFile } from "@/models/MusicFile";
import { isSongLiked, toggleLikeSong } from "@/lib/handleFavorites";

const SongHeart = ({
  song,
  iconSize = 20,
}: {
  song: MusicFile;
  iconSize: number;
}) => {
  const [isLiked, setIsLiked] = useState<any>(false);

  useEffect(() => {
    const checkIsLiked = async () => {
      console.log(song);
      const isLiked = await isSongLiked(song._id);
      setIsLiked(isLiked);
    }
    checkIsLiked();
  }, [song]);

  const toggleLike = async (id: string) => {
    await toggleLikeSong(id);
    setIsLiked(!isLiked);
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
