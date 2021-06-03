import atob from "atob"
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

export const parseJWT = (token: string) => {
    let base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    let jsonPayload = decodeURIComponent(atob(base64).split("").map(c => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(""))

    return JSON.parse(jsonPayload)
}

export default (request: Request, response: Response, next: NextFunction) => {
    let token = request.headers.authorization?.split("Bearer ")[1]
    if (!token) return response.status(401).json({
        auth: false,
        code: 301,
        message: "Nenhum token foi enviado com a requisição."
    })

    jwt.verify(token, process.env.SECRET, (error: any, decoded: any) => {
        if (error) return response.status(401).json({
            auth: false,
            code: 300,
            message: "A operação desejada não é permitida."
        })

        request.userId = decoded.id

        next()
    })
}