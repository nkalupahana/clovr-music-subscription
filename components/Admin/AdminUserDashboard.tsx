import React, { useEffect, useState } from "react";
import { getUsers } from "@/lib/AdminGetUsers";
import { AdminUserTable } from "./AdminUserTable";
import { Input, Button } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
export const AdminUserDashboard = () => {
  const [searchedUser, setSearchedUser] = useState<string>("");
  const [onlySubscribed, setOnlySubscribed] = useState<boolean>(false);
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start py-2">
      <div className="min-w-[70%]">
        <div className="my-4 flex flex-row justify-between">
          <div className="w-1/2">
            <Input
              size="md"
              placeholder="Search for user..."
              startContent={<FaSearch className="text-gray-400" />}
              onChange={(e) => setSearchedUser(e.target.value)}
              isClearable
            />
          </div>
          <Button
            className="ml-4"
            color={onlySubscribed ? "secondary" : "default"}
            onClick={() => setOnlySubscribed(!onlySubscribed)}
          >
            Show subscribed users
          </Button>
        </div>
        <AdminUserTable searchString={searchedUser} onlySubscribed={onlySubscribed} />
      </div>
    </div>
  );
};
