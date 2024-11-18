import {z} from "zod";

//FOR VERIFICATION CODE
export const verifySchema = z.object({
    acceptMessages : z.boolean(),
})