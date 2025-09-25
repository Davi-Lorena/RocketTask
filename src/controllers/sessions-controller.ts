import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";

class SessionsController {

async create(req: Request, res: Response) {

const bodySchema = z.object({
    email: z.string().trim().email({message: "e-mail inválido!"}),
    password: z.string()
})

const { email, password } = bodySchema.parse(req.body)

const userEmail = await prisma.user.findUnique({where: {email}})

if(!userEmail) {
    throw new AppError("E-mail ou senha inválidos!")
}

const passwordMatch = await compare(password, userEmail.password)

if(!passwordMatch) {
    throw new AppError("E-mail ou senha inválidos!")
}




}

}

export { SessionsController }