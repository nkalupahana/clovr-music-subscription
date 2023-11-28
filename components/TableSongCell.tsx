import React from "react";
import { User } from "@nextui-org/react";
import { MusicFile } from "@/models/MusicFile";
import { SearchState } from "@/pages/explore";

const TableSongCell = ({
  song,
  searched = {
    searchString: "",
    searchField: "",
  },
}: {
  song: MusicFile;
  searched?: SearchState;
}) => {
  // Initialize the search string

  const searchString = searched.searchString || "";

  // Create a regular expression for matching the search string, case-insensitive
  const searchRegex = new RegExp(`(${searchString})`, "gi");

  // Replace instances of the search string with highlighted version
  const createHighlightedText = (originalText: string) => {
    return originalText.replace(searchRegex, "<mark>$1</mark>");
  };

  // Create the highlighted name

  const highlightedName = createHighlightedText(song.name);
  const highlightedArtist = createHighlightedText(song.artist);

  return (
    <User
      avatarProps={{
        src: `${process.env.NEXT_PUBLIC_CDN_URL}${song.albumArtKey}`, // switch to album cover when available
        radius: "sm",
        size: "lg",
      }}
      name={
        <span
          className="text-lg text-primary-500 font-semibold"
          dangerouslySetInnerHTML={{ __html: highlightedName }}
        />
      }
      description={
        <span
          className="text-sm text-secondary-500"
          dangerouslySetInnerHTML={{ __html: highlightedArtist }}
        />
      }
    />
  );
};

export default TableSongCell;
