import jwt from "jsonwebtoken"
import database from "../database/connection"
import { Request, Response } from "express"
import { compare } from "../utils/bcrypt"

export default class Login {
    signIn = async (request: Request, response: Response) => {
        const {
            email,
            password
        } = request.body

        try {
            const user = await database("user").where({ active: true }).andWhere({ email }).first()

            if (user) {
                compare(password, user.password).then(result => {
                    if (result) {
                        const { id, role_id } = user

                        const token = jwt.sign({
                            id,
                            role_id
                        }, process.env.SECRET, {
                            expiresIn: 14400
                        })

                        response.status(200).json({ auth: true, token })
                    } else {
                        response.status(500).json({
                            auth: false,
                            code: 200,
                            message: "Senha incorreta."
                        })
                    }
                }).catch(error => {
                    response.status(500).json({
                        auth: false,
                        code: 100,
                        error,
                        message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                    })
                })
            } else {
                response.status(500).json({
                    auth: false,
                    code: 201,
                    message: "Não há usuários cadastrados com esse e-mail."
                })
            }
        } catch (error) {
            response.status(500).json({
                code: 101,
                error,
                message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
            })
        }
    }
}