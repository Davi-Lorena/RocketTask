import { Router } from "express";
import { TasksController } from "@/controllers/tasks-controller";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const tasksRoutes = Router()

const tasksController = new TasksController()

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