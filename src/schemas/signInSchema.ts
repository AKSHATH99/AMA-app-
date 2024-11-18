import {z} from "zod";

//FOR VERIFICATION CODE
export const signInSchema = z.object({
    //email or identifier 
    identifier :z.string(),
    password: z.string().min(6,{message:"PAASWORD MUST BE 6 CHARACTED"})


})