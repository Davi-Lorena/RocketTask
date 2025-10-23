import { Request, Response } from 'express'
import { AppError } from '@/utils/AppError'
import { z } from 'zod'
import { prisma } from '@/database/prisma'
import { Status } from '@prisma/client'
import { Priority } from '@prisma/client'
class TasksController {

    async create(req: Request, res: Response) {

    const bodySchema = z.object({
title: z.string().trim().min(5, "Min five characters!").max(200, "max two thousands characters!"), 
description: z.string().trim().min(10, "min ten characters").max(400, "max 400 characters"),
status: z.nativeEnum(Status),
priority: z.nativeEnum(Priority),
assignedTo: z.string().trim().uuid(),
teamId: z.string().trim().uuid(),
    })

const { title, description, status, priority, assignedTo, teamId  } = bodySchema.parse(req.body)

const team = await prisma.teams.findUnique({
        where: {id: teamId},        
        include: {
        teamMember: {where: {userId: assignedTo}}
        }
    })


if(!team) {
    throw new AppError("Team not found", 404)
}

if(!team?.teamMember.length) {
    throw new AppError("This user is not linked to this team")
}

const existingTask = await prisma.tasks.findFirst({
            where: {
                title, // Verifica pelo título (ou faça um LIKE/contém, se preferir)
                assignedTo, // Atribuída ao mesmo usuário
                teamId, // No mesmo time/projeto
                status: {
                    // Exclui tarefas que já foram concluídas ou canceladas,
                    // pois um usuário pode querer criar uma "Tarefa X" novamente
                    notIn: [Status.completed] 
                }
            }
        })

        if (existingTask) {
            // Usa 409 Conflict para indicar que a requisição não pode ser completada
            // devido a um conflito com o estado atual do recurso.
            throw new AppError("An active task with this title already exists for this member in this team.", 409)
        }


const task = await prisma.tasks.create({
    data: {
      title,
        description,
        status,
        priority,
        assignedTo,
        teamId  
    }
})


        res.status(201).json(task)
    }

}

export { TasksController}