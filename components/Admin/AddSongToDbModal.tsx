import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { z } from "zod";
import { addSongToDb } from "@/lib/AddSongToDb";

const songInitialState = {
  title: "",
  artist: "",
  releaseDate: "",
  durationSeconds: "",
  musicFile: null,
  albumArt: null,
};

export const AddSongToDbModal = ({
  isOpen,
  onClose,
  error,
  setError,
  setSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  error: string;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}) => {
  const [songData, setSongData] = useState(songInitialState);
  const [loadingToDb, setLoadingToDb] = useState(false); // TODO: Implement loading spinner [loadingToDb
  const [AddSongSchema, setAddSongSchema] = useState(z.object({}));

  useEffect(() => {
    const AddSongSchema = z.object({
      title: z.string().max(100).min(1, {
        message: "Title must be between 1 and 100 characters",
      }),
      artist: z.string().max(100).min(1, {
        message: "Artist must be between 1 and 100 characters",
      }),
      releaseDate: z.date().max(new Date(), {
        message: "Release date must be in the past",
      }),
      durationSeconds: z.number().max(1000).min(1, {
        message: "Duration must be between 1 and 1000 seconds",
      }),
      musicFile: z.instanceof(File),
      albumArt: z.instanceof(File).optional(),
    });

    setAddSongSchema(AddSongSchema);
  }, []);

  const handleSubmit = async () => {
    if (!songData.musicFile) {
      setError("Please upload a music file.");
      return;
    }
    setLoadingToDb(true);
    try {
      // Convert durationSeconds to a number and releaseDate to a Date object
      const validatedData = {
        ...songData,
        durationSeconds: parseInt(songData.durationSeconds),
        releaseDate: new Date(songData.releaseDate),
      };

      AddSongSchema.parse(validatedData);
      // Proceed with validated data

      const res = await addSongToDb(validatedData);
      console.log("res:", res);
      if (res === undefined) {
        throw new Error("Error adding song to database");
      }
      setSongData(songInitialState);
      setSuccess("Successfully added song!");
      setError("");
      onClose(); // Close the modal on successful submission
    } catch (e) {
      console.log("Error:", e);
      if (e instanceof z.ZodError) {
        setError(e.errors.map((err) => err.message).join(", "));
      }
    } finally {
      setLoadingToDb(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, files, type } = e.target;
    if (e.target.type === "file") {
      setSongData({ ...songData, [e.target.name]: e.target.files[0] });
    } else {
      setSongData({
        ...songData,
        [name]: type === "file" ? files[0] : value,
      });
    }
  };

  const clearInput = (inputName: any) => {
    setSongData({
      ...songData,
      [inputName]:
        inputName === "musicFile" || inputName === "albumArt" ? null : "",
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Add Song</ModalHeader>
        <ModalBody>
          <Input
            isClearable
            onClear={() => clearInput("title")}
            placeholder="Title"
            name="title"
            value={songData.title}
            onChange={handleChange}
          />
          <Input
            isClearable
            onClear={() => clearInput("artist")}
            placeholder="Artist"
            name="artist"
            value={songData.artist}
            onChange={handleChange}
          />
          <Input
            isClearable
            onClear={() => clearInput("releaseDate")}
            label="Release Date"
            placeholder="Release Date"
            name="releaseDate"
            value={songData.releaseDate}
            onChange={handleChange}
            type="date"
          />
          <Input
            isClearable
            onClear={() => clearInput("durationSeconds")}
            placeholder="Duration (seconds)"
            name="durationSeconds"
            value={songData.durationSeconds}
            onChange={handleChange}
            type="number"
          />
          <Input
            isClearable
            label="Music File (.wav)"
            onClear={() => clearInput("musicFile")}
            placeholder="Music File (.wav)"
            name="musicFile"
            type="file"
            onChange={handleChange}
          />
          <Input
            isClearable
            label="Album Art (.png)"
            onClear={() => clearInput("albumArt")}
            placeholder="Album Art (.png)"
            name="albumArt"
            type="file"
            onChange={handleChange}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            disabled={loadingToDb}
            isLoading={loadingToDb}
          >
            {loadingToDb ? "Adding..." : "Add Song"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
