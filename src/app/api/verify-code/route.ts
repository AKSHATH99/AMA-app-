import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decoededUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decoededUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    console.log(isCodeNotExpired , isCodeValid)

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      const savedUser = await user.save();
      return Response.json(
        { success: true, message: "verification success" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        { success: false, message: "CODE EXPIRED MY BUDDY" },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "CODE wrong buddy " },
        { status: 200 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "ERROR HAHAHAHAHAHAHA",
      },
      { status: 400 }
    );
  }
}
