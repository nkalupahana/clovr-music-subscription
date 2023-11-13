import dbConnect from "@/lib/dbConnect";
import User, { User as UserType } from "@/models/User";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const DEV_DEPLOY = process.env.NODE_ENV === "development";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    ...(DEV_DEPLOY
      ? [
          CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
              email: { label: "Email", type: "text", placeholder: "jsmith" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
              if (!credentials) return null;
              const { email, password } = credentials;
              if (password !== process.env.TEST_PASSWD) return null;

              await dbConnect();
              const user = await User.findOne({
                email,
              });

              return user;
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user }: any) {
      await dbConnect();

      if (user) {
        const foundUser = await User.findOne({ email: user.email });
        if (!foundUser) {
          const newUser = new User({
            name: user.name,
            email: user.email,
            isAdmin: false,
          });
          await newUser.save();
        }
      }

      return true;
    },
    async jwt({ token, account, trigger }: any) {
      if (account || trigger === "update") {
        const user = (await User.findOne({ email: token.email })) as UserType;
        token.isAdmin = user.isAdmin ?? false;
        token.subscribed = !!user.subscription;
      }

      return token;
    },
    async session({ session, token }: any) {
      session.user.isAdmin = token.isAdmin;
      session.user.subscribed = token.subscribed;

      return session;
    },
  },
};

export default NextAuth(authOptions);
