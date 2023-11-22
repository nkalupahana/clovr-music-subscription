import { User } from "../models/User";
export const getUsers = async () => {
  const res = await fetch("/api/admin/users");

  const json = await res.json();

  return json.users as User[];
};
