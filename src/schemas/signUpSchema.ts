import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be 2 characters")
  .max(20, "Must not be more than 20")
  .regex(/[a-zA-Z0-9_]+$/, "special char not allowed")

export const  signUpSchema = z.object({
    username : usernameValidation,
    email:z.string().email({message: "INVALID MAIL "}),
    password: z.string().min(6,{message:"PAASWORD MUST BE 6 CHARACTED"})
})
 