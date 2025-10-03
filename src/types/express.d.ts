declare namespace Express {
    export interface Request {
        user?: {
            role: string
            user_id: string
        }
    }
}