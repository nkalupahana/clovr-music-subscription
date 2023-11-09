import React from "react";
import PageHeader from "@/components/PageHeader";
import { Tabs, Tab } from "@nextui-org/react";
import { AdminMusicDashboard } from "@/components/AdminMusicDashboard";
import { AdminUserDashboard } from "@/components/AdminUserDashboard";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center  w-full py-2">
      <PageHeader>Admin Dashboard</PageHeader>
      <Tabs
        aria-label="Options"
        color="primary"
        className="w-full items-center  justify-center mt-4"
      >
        <Tab key="music" title="Music" className="w-full text-xl">
          <AdminMusicDashboard />
        </Tab>
        <Tab key="users" title="Users" className="w-full text-xl">
          <AdminUserDashboard />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
