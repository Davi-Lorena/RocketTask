import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const teamsController = new TeamsController()

const teamsRoutes = Router()

teamsRoutes.post("/", verifyAuthorization(["admin"]), teamsController.create)

export { teamsRoutes }