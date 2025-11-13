import { Router } from "express";
import { UsersController } from "@/controllers/users-controller";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const usersRoutes = Router();

const usersController = new UsersController

usersRoutes.get("/", 
    verifyAuthorization(["admin"])
    ,usersController.index)

usersRoutes.put("/:id", 
    verifyAuthorization(["member"])
    ,usersController.update)

usersRoutes.delete("/:id", 
    verifyAuthorization(["admin", "member"])
    ,usersController.delete)

usersRoutes.get("/:id", 
    verifyAuthorization(["admin", "member"])
    ,usersController.showTasks)

export {usersRoutes}