import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"


class TeamsController {

async create(req: Request, res: Response) {

    const bodySchema = z.object({
        name: z.string().min(5, "Mínimo 5 caractertes").max(100, "Máximo 100 caracteres").trim(),
        description: z.string().trim().optional()
    })

    const {name, description} = bodySchema.parse(req.body)

    const nameExist = await prisma.teams.findFirst({where: {name}})

    if(nameExist) {
        throw new AppError("This name already exist!")
    }

 await prisma.teams.create({
    data: {
        name,
        description
    }
 })


    res.status(201).json({name, description})
}


}


export { TeamsController }
