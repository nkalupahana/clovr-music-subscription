import dbConnect from "@/lib/dbConnect";
import User, { User as UserType } from "@/models/User";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"


export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
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
                        isAdmin: false
                    });
                    await newUser.save();
                }
            }

            return true;
        },
        async jwt({ token, account, trigger }: any) {
            if (account || trigger === "update") {
                const user = await User.findOne({ email: token.email }) as UserType;
                token.isAdmin = user.isAdmin ?? false;
                token.subscribed = !!user.subscription;
            }

            return token;
        },
        async session({ session, token }: any) {
            session.user.isAdmin = token.isAdmin;
            session.user.subscribed = token.subscribed;
            
            return session;
        }
    },
}

export default NextAuth(authOptions);