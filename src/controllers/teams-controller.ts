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

async index(req: Request, res: Response) {

    const teams = await prisma.teams.findMany()

  const teamsWithDescription = teams.map(team => {
    
            const teamData = { ...team } as any
        if (teamData.description === null) {
            delete teamData.description
        }
        return teamData
    })

    res.json(teamsWithDescription)
}

async update(req: Request, res: Response) {

const id = req.params.id
const team = await prisma.teams.findUnique({where: {id}})

if(!team) {
    throw new AppError("This team don't exist!")
}

const bodySchema = z.object({
    name: z.string().min(5, "Mínimo 5 caractertes").max(100, "Máximo 100 caracteres").trim(),
    description: z.string().trim().nullable().transform(e => (e === "" ? null : e))
}).partial()

const {name, description} = bodySchema.parse(req.body)

if(name) {
    const nameExist = await prisma.teams.findFirst({where: {name, id: { not: id }}})

    if(nameExist) {
        throw new AppError("This name already exist!")
    }
}

const updateTeam = await prisma.teams.update({
    where: {id},
    data: {
        name,
        description
    }
})

res.json({ updateTeam })
}


}


export { TeamsController }
