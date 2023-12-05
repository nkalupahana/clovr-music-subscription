import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@nextui-org/react";
export const SignInWithGoogle = () => {
  return (
    <Button
      
      onClick={() =>
        signIn(process.env.NODE_ENV === "development" ? "email" : "google")
      }
      size="lg"
      radius="none"
      id="google-sign-in"
      className="text-sm md:text-lg rounded-md border border-primary-500 hover:bg-primary-500 hover:text-white"
    >
      Sign in with <FcGoogle className="inline-block ml-2 " size={24} />
    </Button>
  );
};
