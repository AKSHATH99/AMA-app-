// CONTROLL FLOW 

// IF USER WITH A USERNAME EXIST 
//          ----BUT HE HAS NOT VERIFIED HIMSELF(isverified: false) , ALLOW CREATION OF ANOTHE USER WITH SAME USERNAME -> SEND EMAIL AFTER CREATION
//          ----BUT IF USER IS VERIFIED , CANNOT ALLOW NEW USER CREATION ON SAME USERNAME -> THROW ERROR
//
//IF USER WITH USERNAME DOESNT EXIT 
//          ----CREATE NEW USER WITH THAT USERNAME -> SEND MAIL 



import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcrypt";
import { log } from "console";


export async function POST(request: Request) {
  //Connect to db
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerification = await UserModel.findOne({
      username,
      isVerified: true,
    });

    //Check if usrname already exist in db
    if (existingUserVerification) {
      return Response.json(
        {
          //found user , user already exist and is already verifired  , so cannot do registration , so false
          success: false,
          message: "Username taken",
        },
        { status: 400 }
      );
    }

    const existinguserbyMail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 9000).toString();

    if (existinguserbyMail) {
      if (existinguserbyMail.isVerified) {
        //verified user is there and he is verified also
        return Response.json(
          {
            success: false,
            message: "USer with alrady ind",
          },
          { status: 500 }
        );
      } else {

        //verified user is there BUT he is NOT verified 

        const hashedPassword=await bcrypt.hash(password, 10);
        existinguserbyMail.password=hashedPassword;
        existinguserbyMail.verifyCode=verifyCode;
        existinguserbyMail.verifyCodeExpiry= new Date(Date.now()+360000);
        await existinguserbyMail.save();

        //controll will now jump to part when it sends mail 
    }
    } else {
      //If user doesnt exist create new field for him and save into db
      const hashedPassword = await bcrypt.hash(password, 10);
      const expirydate = new Date();
      expirydate.setHours(expirydate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expirydate,
        isAcceptingMessage: true,
        isVerified: false,
        messages: [],
      });

      //saved to db
      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "registered . Check email",
      },
      { status: 201 }
    );
  } catch (error) {
    log(error, "Error regstring user , mail sending while");
    return Response.json({
      success: false,
      message: "Error regstring user",
    });
  }
}
