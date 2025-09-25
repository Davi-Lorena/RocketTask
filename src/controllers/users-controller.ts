import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma";
import { userRole } from "@/generated/prisma";

class UsersController {


async create(req: Request, res: Response) {

const bodySchema = z.object({
name: z.string().min(3, {message: "Min 6 characters"}).max(100, {message: "Max 100 characters"}).trim(),
email: z.string().trim().email({ message: "e-mail is required"}).toLowerCase(),
password: z.string().trim().min(6, {message: "min 6 characters"}),
role: z.enum([userRole.member, userRole.admin]).default(userRole.member)

})

const { name, email, password } = bodySchema.parse(req.body)


    res.json({name, email, password })
}


}

export { UsersController };