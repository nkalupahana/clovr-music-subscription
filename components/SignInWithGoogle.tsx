import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@nextui-org/react";
export const SignInWithGoogle = () => {
  return (
    <Button
      color="primary"
      onClick={() =>
        signIn(process.env.NODE_ENV === "development" ? "email" : "google")
      }
      size="lg"
      radius="none"
      id="google-sign-in"
      className="text-sm md:text-lg"
    >
      Sign in with <FcGoogle className="inline-block ml-2 bg-white" size={24} />
    </Button>
  );
};
