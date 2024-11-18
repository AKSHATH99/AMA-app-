import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {

    if(request.method!=='GET'){
        return Response.json(
            {
              success: false,
              message: "YOU HIT POST REQ  MY  FRIEND ,  GET ONLY ACCEPTED "
            },
            { status: 400 }
          );
    }
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryparam = {
      username: searchParams.get("username"),
    };

    //validate usinng zod
    const result = usernameQuerySchema.safeParse(queryparam);
    console.log("zod result ->", result);

    if (!result.success) {
      //only take error related to username i guess
      const usernameError = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(",")
              : "invalid query parameter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "USERNAME IS ALREADY TAKEN . USE ANOTHER LOSER",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available ",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("ERROR CHECKING USERNAME ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username ",
      },
      { status: 500 }
    );
  }
}
