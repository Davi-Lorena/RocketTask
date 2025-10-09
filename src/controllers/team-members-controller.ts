import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class TeamMembersController {

async create(req: Request, res: Response) {

const bodySchema = z.object({
    userId: z.string().trim(),
    teamId: z.string().trim()
})

const {userId, teamId} = bodySchema.parse(req.body)

// Verifica se existe tanto o time quanto o user
// 💡 MELHORIA: Busca paralela usando Promise.all
const [user, team] = await Promise.all([
    prisma.user.findUnique({where: {id: userId}}),
    prisma.teams.findUnique({where: {id: teamId}})
]);

if(!user) {
    throw new AppError("This user dont't exist!")
}

if(!team) {
    throw new AppError("This team dont't exist!")
}

  const existingMember = await prisma.teamMembers.findFirst({where: {userId, teamId}})

        if (existingMember) {
            throw new AppError("This user is already a member of this team!", 409)
        }

await prisma.teamMembers.create({
    data: {
        userId,
        teamId
    }
})



    res.status(201).json({message: "Relationship created!", userId, teamId})
}

}

export { TeamMembersController }