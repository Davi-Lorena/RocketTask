import { Router } from "express";
import { CreateUserController } from "@/controllers/create-user-controller";

const createUserRoutes = Router();

const createUserController = new CreateUserController();

createUserRoutes.post("/", createUserController.create)

export { createUserRoutes }