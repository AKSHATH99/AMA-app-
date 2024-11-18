import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  //session verification
  const session = await getServerSession(authOption);
  const user = session?.user;

  console.log(session)

  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userID = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { id: userID } },

      //The $unwind stage in a MongoDB pipeline is used to "unpack" arrays, turning each element within the array into a separate
      //document. It’s particularly useful when you have documents with array fields and you want to process each element of that array
      //as an independent document.
      { $unwind: "$messages" },

      { $sort: { "messages.createdAt": -1 } },

      //group everything back based on id , it was splited using unwind , now group back
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "No  user found hahaha" },
        { status: 401 }
      );
    }

    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 401 }
    );
  } catch (error) {}

  const userId = user._id;
}
