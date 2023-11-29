import { Button, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { deleteUser } from "@/lib/AdminDeleteUser";
export const DeleteUserModal = ({
  isOpen,
  onClose,
  userToDelete,
  users,
  setUsers,
}: {
  isOpen: boolean;
  onClose: () => void;
  userToDelete: any;
  users: any;
  setUsers: any;
}) => {
  const handleDelete = async () => {
    let res = await deleteUser(userToDelete._id);
    let newUsers = users.filter((user: any) => {
      return user._id !== userToDelete._id;
    });
    setUsers(newUsers);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalBody className="flex flex-col items-center justify-center gap-4 p-8">
          <h1>Are you sure you want to delete</h1>
          <h1 className="font-bold">{userToDelete.name}</h1>
          <div className="flex flex-row gap-4">
            <Button
              className="btn bg-red-400"
              onClick={() => {
                handleDelete();
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
  );
};
