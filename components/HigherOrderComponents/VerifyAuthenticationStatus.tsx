import React, { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type VerifyAuthenticationStatusProps = {
  children: React.ReactNode;
}

const VerifyAuthenticationStatus: React.FC<VerifyAuthenticationStatusProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return <>{children}</>;
};

export default VerifyAuthenticationStatus;
