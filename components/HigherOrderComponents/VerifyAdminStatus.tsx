import React, { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type VerifyAdminStatusProps = {
  children: React.ReactNode;
}

const VerifyAdminStatus: React.FC<VerifyAdminStatusProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user.isAdmin) {
      router.push("/");
    }
  }, [session, router]);

  if (status === "loading") return <p>Hang on there...</p>;

  return <>{children}</>;
};

export default VerifyAdminStatus;
