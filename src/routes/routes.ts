import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { createUserRoutes } from "./create-user-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamsRoutes } from "./teams-routes";
import { teamMembersRoutes } from "./teams-members-routes";
import { tasksRoutes } from "./tasks-routes";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const routes = Router()

routes.use("/users", createUserRoutes)
routes.use("/sessions", sessionsRoutes)

routes.use(ensureAuthenticated)

routes.use("/users", usersRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/tmembers", teamMembersRoutes)
routes.use("/tasks", tasksRoutes)


export { routes }
