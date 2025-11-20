import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma";
import { userRole } from "@/generated/prisma";
import { hash } from "bcrypt";
import { AppError } from "@/utils/AppError";

class UsersController {

async index(req: Request, res: Response) {

const querySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10)
    })

const { page, perPage} = querySchema.parse(req.query)

const skip = (page - 1) * perPage

const users = await prisma.user.findMany({
  skip,
  take: perPage
})

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

const { id } = paramsSchema.parse(req.params)

const user = await prisma.user.findUnique({
  where: { id },
});

if (!user) {
  throw new AppError("User not found!", 404);
}

if(id !== req.user?.user_id) {
  throw new AppError("You can only update your own user!", 403);
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
    where: {id},
    data, 
  });

  res.status(200).json({ user: updatedUser });

}

async delete(req: Request, res: Response) {

const paramsSchema = z.object({
    id: z.string().uuid()
})

const { id } = paramsSchema.parse(req.params)

if(req.user?.role !== "admin" && id !== req.user?.user_id) {
  throw new AppError("You can only delete your own user!", 403);
}

const user = await prisma.user.findUnique({where: {id}})

if(!user) {
    throw new AppError("User not Found", 404)
}

const team = await prisma.teamMembers.findFirst({
  where: {
    userId: id
  }
})

const tasks = await prisma.tasks.findMany({
  where: {
    assignedTo: id
  }
})

if(tasks.length > 0 || team) {
  throw new AppError("This user has tasks or is in a team. He cannot be delete", 400)
}


await prisma.user.delete({
    where: { id }
})

    res.status(204).json()
}

async showTasks(req: Request, res: Response) {

const paramsSchema = z.object({
  id: z.string().uuid()
})

const {id} = paramsSchema.parse(req.params)

const querySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10)
    })

const { page, perPage} = querySchema.parse(req.query)

const skip = (page - 1) * perPage

if(req.user?.role !== "admin" && id !== req.user?.user_id) {
throw new AppError("You cant view your tasks and your team tasks!")
}


const memberTasks = await prisma.tasks.findMany({
  skip,
  take: perPage,
  where: {
    assignedTo: id
  }
})



res.json({ memberTasks })

}


}

export { UsersController };