import { Router } from "express";
import { TeamMembersController } from "@/controllers/team-members-controller";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const teamsController = new TeamMembersController()

const teamMembersRoutes = Router()

teamMembersRoutes.post("/", verifyAuthorization(["admin"]), teamsController.create)

export { teamMembersRoutes }