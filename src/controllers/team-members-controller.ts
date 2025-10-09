import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class TeamMembersController {

async create(req: Request, res: Response) {

    res.json({message: "ok"})
}

}

export { TeamMembersController }