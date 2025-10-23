import { Router } from "express";
import { TasksController } from "@/controllers/tasks-controller";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const tasksRoutes = Router()

const tasksController = new TasksController()

tasksRoutes.post("/", 
    verifyAuthorization(["admin"]), 
    tasksController.create)

export {tasksRoutes}