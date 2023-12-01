import { Button, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import TableSongCell from "../TableSongCell";
import { deleteSongFromDb } from "@/lib/DeleteSongFromDb";
import { MusicFile } from "@/models/MusicFile";
export const DeleteSongModal = ({
    isOpen,
    onClose,
    songToDelete,
    filteredSongs,
    setFilteredSongs
}: {
    isOpen: boolean;
    onClose: () => void;
    songToDelete: MusicFile;
    filteredSongs: any[];
    setFilteredSongs: any;

}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalBody className="flex flex-col items-center justify-center gap-4 p-8">
              <TableSongCell song={songToDelete} />
              <div className="flex flex-row gap-4">
                <Button
                  className="btn bg-red-400"
                  onClick={() => {
                    console.log(songToDelete);
                    deleteSongFromDb(songToDelete._id);
                    
                    setFilteredSongs(
                      filteredSongs.filter(
                        (song) => song._id !== songToDelete._id
                      )
                    );
                    onClose();
                  }}
                >
                  <span className="font-bold">Delete</span>
                </Button>
                <Button className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
    )
}