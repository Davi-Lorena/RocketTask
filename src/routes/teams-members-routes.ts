import { Router } from "express";
import { TeamMembersController } from "@/controllers/team-members-controller";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const teamsController = new TeamMembersController()

const teamMembersRoutes = Router()
teamMembersRoutes.use(verifyAuthorization(["admin"]))

teamMembersRoutes.post("/", teamsController.create)
teamMembersRoutes.delete("/:id", teamsController.remove)


export { teamMembersRoutes }