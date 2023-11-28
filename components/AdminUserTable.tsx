import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { getUsers } from "@/lib/AdminGetUsers";
import { CiCircleRemove } from "react-icons/ci";
import { DeleteUserModal } from "./DeleteUserModal";
import { User } from "@/models/User";
import { getUserSubscription } from "@/lib/AdminGetUserSubscription";

export const AdminUserTable = ({
  searchString,
  onlySubscribed,
}: {
  searchString: string;
  onlySubscribed: boolean;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState<User[] | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [userDeletedMessage, setUserDeletedMessage] = useState<string>("");
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  useEffect(() => {
    const helper = async () => {
      const users = await getUsers();
      setUsers(users);
      setFilteredUsers(users);
    };

    helper();
  }, []);

  useEffect(() => {
    if (onlySubscribed) {
      setFilteredUsers(users?.filter((user) => user.subscription) || []);
    } else {
      setFilteredUsers(users);
    }
  }, [onlySubscribed, users]);

  return (
    <>
      {filteredUsers ? (
        <Table>
          <TableHeader>
            <TableColumn className="text-start">Name</TableColumn>
            <TableColumn className="text-start">Email</TableColumn>
            <TableColumn className="text-start">Subscribed?</TableColumn>
            <TableColumn className="text-start"> </TableColumn>
          </TableHeader>
          <TableBody items={filteredUsers}>
            {filteredUsers
              .filter((user) =>
                user.name.toLowerCase().includes(searchString.toLowerCase())
              )

              .map((user: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    {user.subscription ? (
                      <Popover placement="right">
                        <PopoverTrigger>
                          <Button
                            color="primary"
                            onClick={async () => {
                              if (!user.subscription) {
                                return;
                              }
                              let res = await getUserSubscription(
                                user.subscription
                              );
                              setSelectedSubscription(res);
                            }}
                          >
                            View Details
                          </Button>
                        </PopoverTrigger>
                        {selectedSubscription && (
                          <PopoverContent>
                            <div className="flex flex-row justify-between gap-4">
                              <p>Status:</p>
                              <p className="font-bold">
                                {selectedSubscription.status}
                              </p>
                            </div>
                            <div className="flex flex-row justify-between gap-4">
                              <p># channels:</p>
                              <p className="font-bold">
                                {selectedSubscription.quantity}
                              </p>
                            </div>
                          </PopoverContent>
                        )}
                      </Popover>
                    ) : (
                      "No"
                    )}
                  </TableCell>
                  <TableCell>
                    <CiCircleRemove
                      size={32}
                      className="text-red-500 cursor-pointer"
                      onClick={() => {
                        setUserToDelete(user);
                        onOpen();
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <div>Loading...</div>
      )}
      {userToDelete && (
        <DeleteUserModal
          isOpen={isOpen}
          onClose={onClose}
          userToDelete={userToDelete}
          users={users}
          setUsers={setUsers}
        />
      )}
    </>
  );
};
