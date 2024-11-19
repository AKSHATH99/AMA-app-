//import everything

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

//export the next auth congig
export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",

      //these credentials are used to login or sign in , you can put username and passowrd also
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      //This function defines the custom verification you write by calling query to db
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
      console.log("AM GOING THROUGH OPTIONS ")


        try {
          //Find user is real or not
          console.log("123 inside options ")

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });


          if (!user) {
            throw new Error("Not found with this email");
          }

          //Make sure he is verified
          if (!user.isVerified) {
            throw new Error("PLEASE VERIFY BEFORE LOGIIN");
          }

          //Password verification
          const correctpass = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (correctpass) {
            return user;
          } else {
            throw new Error("Incorrect password ");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],

  //Callbacks is used to set session and jwt and other authentication tools ,
  callbacks: {
    async session({ session, token }) {

      if (token && session.user ) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },

    async jwt({ token, user }) {
      //wherever you have access to token , you can access these values from it
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }

      return token;
    },
  },

  //define the pagees where auth is used
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: "1234567",
};
