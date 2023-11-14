import PageHeader from "@/components/PageHeader";
import { AdminUserDashboard } from "@/components/AdminUserDashboard";

const Admin = () => {
  return (
    <div className="flex flex-col items-center justify-center  w-full py-2">
      <PageHeader>Admin Dashboard</PageHeader>
      <div
        aria-label="Options"
        color="primary"
        className="w-full items-center  justify-center mt-4"
      >
        <div key="music" title="Music" className="w-full text-xl">
        </div>
        <div key="users" title="Users" className="w-full text-xl">
          <AdminUserDashboard />
        </div>
      </div>
    </div>
  );
};

export default Admin;
