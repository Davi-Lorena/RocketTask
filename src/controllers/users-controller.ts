import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma";
import { userRole } from "@/generated/prisma";
import { hash } from "bcrypt";
import { AppError } from "@/utils/AppError";

class UsersController {


async create(req: Request, res: Response) {

const bodySchema = z.object({
name: z.string().min(3, {message: "Min 6 characters"}).max(100, {message: "Max 100 characters"}).trim(),
email: z.string().trim().email({ message: "e-mail is required"}).toLowerCase(),
password: z.string().trim().min(6, {message: "min 6 characters"}),
role: z.enum([userRole.member, userRole.admin]).default(userRole.member)

})

const { name, email, password, role } = bodySchema.parse(req.body)

const userWithSameEmail = await prisma.user.findFirst({where: {email}})

if(userWithSameEmail) {
throw new AppError("This email already be used!")
}

const hashedPassword = await hash(password, 8)

await prisma.user.create({
    data: { 
    name,
    email,
    password: hashedPassword,
    role
    }
})

    res.status(201).json()
}

async index(req: Request, res: Response) {
const users = await prisma.user.findMany()

res.json({ users })
}

}

export { UsersController };