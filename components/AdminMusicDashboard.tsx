import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { z } from "zod";
import { addSongToDb } from "@/lib/AddSongToDb";

const AddSongSchema = z.object({
  title: z.string().max(100),
  artist: z.string().max(100),
  releaseDate: z.date().max(new Date()),
  durationSeconds: z.number().max(1000),
  musicFile: z.instanceof(File),
  albumArt: z.instanceof(File),
});

export const AdminMusicDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [songData, setSongData] = useState({
    title: "",
    artist: "",
    releaseDate: "",
    durationSeconds: "",
    musicFile: null,
    albumArt: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleSubmit = async () => {
    try {
      // Convert durationSeconds to a number and releaseDate to a Date object
      const validatedData = {
        ...songData,
        durationSeconds: parseInt(songData.durationSeconds),
        releaseDate: new Date(songData.releaseDate),
      };

      AddSongSchema.parse(validatedData);
      // Proceed with validated data
      console.log("Validated Song Data:", validatedData);
      const res = await addSongToDb(validatedData);
      if (res === undefined) {
        throw new Error("Error adding song to database");
      }

      setSuccess("Successfully added song!");
      onClose(); // Close the modal on successful submission
    } catch (e) {
      console.log("Error:", e);
      if (e instanceof z.ZodError) {
        setError(e.errors.map((err) => err.message).join(", "));
      }
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-row justify-start items-center px-12">
        <Button
          className="hover:scale-105 transition-all duration-200"
          color="secondary"
          onPress={onOpen}
        >
          + Add Song
        </Button>
        {success && <p style={{ color: "green" }}>{success}</p>}
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
              <Button color="primary" onPress={handleSubmit}>
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
