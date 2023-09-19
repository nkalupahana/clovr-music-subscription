import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
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
                    });
                    await newUser.save();
                }
            }

            return true;
        }
    },
}

export default NextAuth(authOptions);