import { Request, Response } from "express"
import database from "../database/connection"
import { parseJWT } from "../utils/authorization"

export default class Notification {
    create = async (request: Request, response: Response) => {
        let {
            day,
            type,
            module_id,
            subject_id,
            time_id,
            user_id
        } = request.body

        const { conflict_id } = response.locals

        type = type ? type : response.locals.type

        const transaction = await database.transaction()

        if (user_id) {
            try {
                if (day && subject_id && time_id) {
                    await transaction("notification").insert({
                        day,
                        type,
                        module_id,
                        subject_id,
                        time_id,
                        user_id
                    })
                } else {
                    await transaction("notification").insert({
                        type,
                        user_id
                    })
                }

                await transaction.commit()

                response.status(201).send()
            } catch (error) {
                await transaction.rollback()

                response.status(500).json({
                    code: 101,
                    error,
                    message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                })
            }
        } else {
            await transaction.rollback()

            const array = []

            if (!type)
                array.push("tipo")
            if (!conflict_id)
                array.push("conflito")
            if (!user_id)
                array.push("professor")

            response.status(500).json({
                code: 202,
                message: "Preencha todos os campos: " + array.join(", ") + "."
            })
        }
    }

    delete = async (request: Request, response: Response) => {
        const { id } = request.params

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                await transaction("notification").where({ id }).del()

                await transaction.commit()

                response.status(204).send()
            } catch (error) {
                await transaction.rollback()

                response.status(500).json({
                    code: 101,
                    error,
                    message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    index = async (request: Request, response: Response) => {
        const filters = request.query

        let notifications

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                const user_id = filters.user_id as string

                if (user_id) {
                    notifications = await database("notification").where({ user_id })

                    response.status(200).json(notifications)
                } else response.status(500).json({
                    code: 202,
                    message: "Preencha todos os campos: usuário"
                })
            } catch (error) {
                response.status(500).json({
                    code: 101,
                    error,
                    message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }
}