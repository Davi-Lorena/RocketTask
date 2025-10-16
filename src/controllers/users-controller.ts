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

async update(req: Request, res: Response) {

    const bodySchema = z.object({
name: z.string().trim().min(3, {message: "Min 6 characters"}).max(100, {message: "Max 100 characters"}),
email: z.string().trim().email({ message: "e-mail is required"}).toLowerCase(),
password: z.string().trim().min(6, {message: "min 6 characters"}),
role: z.enum([userRole.member, userRole.admin]).default(userRole.member)
}).partial() // garante que todos os parâmetros sejam opcionais 

const paramsSchema = z.object({
    id: z.string().uuid()
})

const id = paramsSchema.parse(req.params)

const user = await prisma.user.findUnique({
  where: id,
});

if (!user) {
  throw new AppError("User not found!", 404);
}

const {name, email, password, role} = bodySchema.parse(req.body)


  if (email) { 
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail && userWithSameEmail.id !== user.id) {
      throw new AppError("This email is already in use by another user!", 409);
    }
  }

const data: any = { name, email, role };

  if (password) {
    data.password = await hash(password, 8);
  }

  const updatedUser = await prisma.user.update({
    where: id,
    data, 
  });

  res.status(200).json({ user: updatedUser });

}

async delete(req: Request, res: Response) {

const paramsSchema = z.object({
    id: z.string().uuid()
})

const id = paramsSchema.parse(req.params)

const user = await prisma.user.findUnique({where: id})

if(!user) {
    throw new AppError("User not Found", 404)
}

await prisma.user.delete({
    where: id
})

    res.status(204).json()
}

}

export { UsersController };