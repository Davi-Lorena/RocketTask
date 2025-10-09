import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const teamsController = new TeamsController()

const teamsRoutes = Router()

teamsRoutes.post("/", verifyAuthorization(["admin"]), teamsController.create)
teamsRoutes.get("/", teamsController.index)
teamsRoutes.put("/:id", verifyAuthorization(["admin"]), teamsController.update)

export { teamsRoutes }