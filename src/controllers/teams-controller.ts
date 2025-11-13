import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"


class TeamsController {

async create(req: Request, res: Response) {

    const bodySchema = z.object({
        name: z.string().trim().min(5, "Mínimo 5 caractertes").max(100, "Máximo 100 caracteres"),
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

    const teams = await prisma.teams.findMany({
        include: {
            teamMember: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    })

  const teamsWithMember = teams.map(team => {
    
            const teamData = { ...team } as any

teamData.teamMember = team.teamMember.map(member => {
    const { user, ...memberData } = member
    
    return {
        name: user.name,
        email: user.email,
        ...memberData,
    }
})
if (teamData.description === null) {
 delete teamData.description
 }
 return teamData
 })

res.json({teams: teamsWithMember})
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

async delete(req: Request, res: Response) {

const paramsSchema = z.object({
    id: z.string().uuid()
})

const { id } = paramsSchema.parse(req.params)

const team = await prisma.teams.findUnique({
    where: {id}
})

if(!team) {
    throw new AppError("This team don't exist!", 404)
}

const tasks = await prisma.tasks.findFirst({
    where: {
        teamId: id,
        status: {
            not: "completed"
        }
    }
})

if(tasks) {
throw new AppError("The team cannot be deleted if it has pending tasks.", 409)
}

await prisma.teams.delete({
    where: {id}
})

res.status(204).json()

}

async showTeamTasks(req: Request, res: Response) {

const paramsSchema = z.object({
    id: z.string().uuid()
})

const { id } = paramsSchema.parse(req.params)

const userId = req.user?.user_id

const teamWithMember = await prisma.teamMembers.findFirst({
    where: {
        userId: userId,
        teamId: id
    }
})

if(req.user?.role !== "admin" && !teamWithMember) {
    throw new AppError("Unauthorized!", 403)
}

const teamTasks = await prisma.tasks.findMany({
    where: {
        teamId: id
    }
})

res.json({ teamTasks })

}

}


export { TeamsController }
