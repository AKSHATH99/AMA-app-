import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/user.model";

//Function to allow user to toggle between accepting or not accepting messages
export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOption);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        { status: 404 }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("FAILED TO UPDATE USER STATUS TO ACCEPT MESSAGES");
    return Response.json(
      {
        success: false,
        message: "FAILED TO UPDATE USER STATUS TO ACCEPT MESSAGES",
      },
      { status: 500 }
    );
  }
}



//FETCHING IF MESSAGE ACCEPTING STATUS IS TRUE OR FALSE

export async function GET(request: Request) {
    // Connect to the database
    await dbConnect();
  
    // Get the user session
    const session = await getServerSession(authOption);
    const user = session?.user;
  
    // Check if the user is authenticated
    if (!session || !user) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
  
    try {
      // Retrieve the user from the database using the ID
      const foundUser = await UserModel.findById(user._id);
  
      if (!foundUser) {
        // User not found
        return Response.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
  
      // Return the user's message acceptance status
      return Response.json(
        {
          success: true,
          isAcceptingMessages: foundUser.isAcceptingMessage,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error retrieving message acceptance status:', error);
      return Response.json(
        { success: false, message: 'Error retrieving message acceptance status' },
        { status: 500 }
      );
    }
  }