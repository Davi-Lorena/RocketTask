import { Request, Response } from "express"
import { z } from "zod"
import { AppError } from "@/utils/AppError"


class TeamsController {

async create(req: Request, res: Response) {
    res.json({message: "OK"})
}


}


export { TeamsController }
