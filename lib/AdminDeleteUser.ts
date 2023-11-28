export const deleteUser = async (id: string) => {
  const res = await fetch(`/api/admin/user?id=${id}`, {
    method: "DELETE",
  });

  const json = await res.json();

  return json as { message: string };
};
