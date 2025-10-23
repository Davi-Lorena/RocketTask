import { Request, Response } from 'express'
import { AppError } from '@/utils/AppError'
import { z } from 'zod'
import { prisma } from '@/database/prisma'

class TasksController {

    async create(req: Request, res: Response) {

        res.status(201).json({message: "ok"})
    }

}

export { TasksController}