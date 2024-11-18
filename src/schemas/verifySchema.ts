import {z} from "zod";

//FOR VERIFICATION CODE
export const verifySchema = z.object({
    code:z.string().length(6,"6 DIGIT COMPULSORY")
})