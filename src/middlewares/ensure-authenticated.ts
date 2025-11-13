import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '@/utils/AppError';
import { authConfig } from '@/configs/auth';


interface TokenPayload {
    role: string
    sub: string
}

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {

    try {     
        
const authorization = req.headers.authorization


if(!authorization) {
    throw new AppError("Não há token JWT!")
}

// Linha poderosa do jS abaixo, gerando e já desestruturando um array 
const [ , token] = authorization.split(" ")

const {role, sub: user_id} = verify(token, authConfig.jwt.secret) as TokenPayload

req.user = {
    role,
    user_id
}


return next()

    } catch (error) {

 throw new AppError("Token JWT Inválido!")       

    }
}


export { ensureAuthenticated }