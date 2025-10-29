import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const teamsController = new TeamsController()

const teamsRoutes = Router()

teamsRoutes.get("/", teamsController.index)
teamsRoutes.use(verifyAuthorization(["admin"]))

teamsRoutes.post("/", teamsController.create)
teamsRoutes.put("/:id", teamsController.update)
teamsRoutes.delete("/:id", 
    teamsController.delete
)

export { teamsRoutes }