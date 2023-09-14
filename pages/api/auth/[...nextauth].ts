import dbConnect from "@/lib/dbConnect";
import User, { User as UserType } from "@/models/User";
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            await dbConnect();
            if (user) {
                const foundUser = await User.findOne({ email: user.email });
                if (!foundUser) {
                    const newUser = new User({
                        name: user.name,
                        email: user.email,
                    });
                    await newUser.save();
                }
            }

            return token;
        }
    }
}

export default NextAuth(authOptions);