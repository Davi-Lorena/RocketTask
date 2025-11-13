import { Request, Response } from "express"
import { z } from "zod"
import { Status } from "@prisma/client"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"


class TaskHistoryController {

async update(req: Request, res: Response) {

const paramsSchema = z.object({
    id: z.string().uuid()
})

const bodySchema = z.object({
newStatus: z.nativeEnum(Status)
})

const { id } = paramsSchema.parse(req.params)

const { newStatus } = bodySchema.parse(req.body)

const userId = req.user?.user_id

if (!userId) {
    throw new AppError("User ID not found in request context.", 401);
}

const task = await prisma.tasks.findUnique({
    where: { id },
    select: {
        assignedTo: true,
        status: true
    }
})

if(!task) {
    throw new AppError("Task not found!", 404)
}

if(req.user?.role !== "admin" && userId !== task?.assignedTo) {
    throw new AppError("Unauthorized!", 403)
}

if(task.status === newStatus) {
    throw new AppError("Task is already in the desired status!", 400)
}

const statusCompleted = "completed"
const statusRevert = ["pending", "in_progress"]

if ((task.status === statusCompleted && statusRevert.includes(newStatus)) || (task.status === statusRevert[0] && newStatus === statusRevert[1])) {
    throw new AppError(
        `A completed task cannot revert to the status '${newStatus}'.`,
        400
    );
}

const [taskHistory, updatedTask] = await prisma.$transaction([
            prisma.taskHistory.create({
                data: {
                    oldStatus: task.status,
                    taskId: id,
                    changedBy: userId, 
                    newStatus,
                }
            }),

            prisma.tasks.update({
                data: {
                    status: newStatus
                },
                where: {
                    id
                }
            })
        ])

        return res.status(200).json({ task: updatedTask, taskHistory })


}

}

export { TaskHistoryController }