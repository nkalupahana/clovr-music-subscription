import { useEffect, useState } from "react";
import { Button, useDisclosure, Chip } from "@nextui-org/react";
import { z } from "zod";
import { addSongToDb } from "@/lib/AddSongToDb";
import { AddSongToDbModal } from "./AddSongToDbModal";

export const AdminMusicDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        {success && (
          <Chip className="ml-8" color="success" onClose={() => setSuccess("")}>
            {success}
          </Chip>
        )}
        <AddSongToDbModal
          isOpen={isOpen}
          onClose={onClose}
          error={error}
          setError={setError}
          setSuccess={setSuccess}
        />
      </div>
    </div>
  );
};
