import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";

class SessionsController {

async create(req: Request, res: Response) {

const bodySchema = z.object({
    email: z.string().trim().email({message: "e-mail inválido!"}),
    password: z.string()
})

const { email, password } = bodySchema.parse(req.body)

const user = await prisma.user.findUnique({where: {email}})

if(!user) {
    throw new AppError("E-mail ou senha inválidos!")
}

const passwordMatch = await compare(password, user.password)

if(!passwordMatch) {
    throw new AppError("E-mail ou senha inválidos!")
}

const {secret, expiresIn} = authConfig.jwt

const token = sign({user: user.role}, secret, {
    subject: user.id,
    expiresIn
})

const { password: _, ...userWithoutPassword} = user

    res.json({token, user: userWithoutPassword})
}

}


export { SessionsController }