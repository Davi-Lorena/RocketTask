import { Router } from "express";
import { TasksController } from "@/controllers/tasks-controller";
import { verifyAuthorization } from "@/middlewares/verify-authorization";
import { TaskHistoryController } from "@/controllers/task-history-controller";

const tasksRoutes = Router()

const tasksController = new TasksController()
const taskHistoryController = new TaskHistoryController()

tasksRoutes.patch("/:id", 
verifyAuthorization(["member", "admin"]),
taskHistoryController.updateStatus
)

tasksRoutes.use(verifyAuthorization(["admin"]))

tasksRoutes.post("/",  
    tasksController.create)

tasksRoutes.get("/", 
    tasksController.index)

    tasksRoutes.put("/:id",
tasksController.update)

tasksRoutes.delete("/:id", 
    tasksController.delete)


export {tasksRoutes}