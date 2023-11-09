import React, { ReactNode } from 'react';

type HeaderProps = {
  children: ReactNode;
};

const PageHeader: React.FC<HeaderProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center py-2 gap-2 mx-auto min-w-[25%] drop-in">
      <h1
        className="text-center text-6xl font-bold px-12 py-2 rounded-lg w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-gradientAnimation"
        style={{
          backgroundSize: "200% 200%",
        }}
      >
        {children}
      </h1>
    </div>
  );
};

export default PageHeader;
