import { Request, Response, NextFunction } from 'express'

import { AppError } from '@/utils/AppError'

// Array de strings porque eu posso ter várias roles com acesso a uma mesma rota 
function verifyAuthorization(role: string[]) {

    // retorno uma função porque essa função vai ser de fato o middleware (parametrização)
    return (req: Request, res: Response, next: NextFunction) => {

        // Duas verificações: 
        // 1 -> Se o usuário foi autenticado (só haverá req.user se sim)
        // 2 -> Se no array de roles a role do usuário está contida e autorizada a prosseguir nessa rota
if(!req.user || !role.includes(req.user.role)) {
    throw new AppError("Não autorizado!");
}

return next()
    }
}

export { verifyAuthorization }