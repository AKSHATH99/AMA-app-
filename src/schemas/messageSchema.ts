import {z} from "zod";

//FOR VERIFICATION CODE
export const verifySchema = z.object({
    content  : z.string()
    .min(10, {message: " CONTENT MUST BE 10 CHARACTER REQUIRED "})
    .max(300,{message: "Content must be less than 300 characters "})
})