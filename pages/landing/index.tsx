import React from "react";
import PageHeader from "@/components/PageHeader";

const Home: React.FC = () => {
  return (
    <>
    <div className="flex flex-col items-center justify-start w-full min-h-screen pt-12">
      <PageHeader>Welcome to CLOVR</PageHeader>
      <div className="flex flex-col items-center justify-center w-[50%] h-64 mt-8  rounded-lg">
        <p className="text-2xl">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio,
          laborum at hic laudantium autem voluptas eum quaerat adipisci officia
          consectetur, tempore harum suscipit! Quas fugiat, illo a officiis
          error ducimus? Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Quibusdam, voluptate. Quisquam, voluptatum. Quisquam,
          voluptatum. Quisquam, voluptatum. Quisquam, voluptatum. Quisquam,
          voluptatum.
        </p>
        
      </div>
      
    </div>
    </>
  );
};

export default Home;
