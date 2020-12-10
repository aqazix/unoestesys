import { Request, Response, NextFunction } from "express"
import database from "../database/connection"
import { parseJWT } from "../utils/authorization"

export default class Conflict {
    create = async (request: Request, response: Response, next: NextFunction) => {
        const {
            day,
            module_id,
            subject_id,
            time_id,
            user_id
        } = request.body

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            if (day && module_id && subject_id && time_id && user_id) {
                try {
                    await transaction("conflict").insert({
                        day,
                        module_id,
                        subject_id,
                        time_id,
                        user_id
                    })

                    await transaction.commit()

                    response.locals.type = 2

                    next()
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

                if (!day)
                    array.push("data")
                if (!module_id)
                    array.push("módulo")
                if (!subject_id)
                    array.push("disciplina")
                if (!time_id)
                    array.push("horário")
                if (!user_id)
                    array.push("professor")

                response.status(500).json({
                    code: 202,
                    message: "Preencha todos os campos: " + array.join(", ") + "."
                })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    delete = async (request: Request, response: Response, next: NextFunction) => {
        const {
            day,
            time_id,
            user_id
        } = request.body

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (day && user_id && time_id) {
            if (role_id < 4) {
                try {
                    await transaction("conflict").where({
                        day,
                        user_id,
                        time_id
                    }).del()

                    await transaction.commit()

                    response.locals.type = 1

                    next()
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
        } else {
            await transaction.rollback()

            const array = []

            if (!day)
                array.push("data")
            if (!user_id)
                array.push("disciplina")
            if (!time_id)
                array.push("horário")

            response.status(500).json({
                code: 202,
                message: "Preencha todos os campos: " + array.join(", ") + "."
            })
        }
    }

    index = async (request: Request, response: Response) => {
        const filters = request.query

        let conflicts

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                const day = filters.day as string
                const module_id = filters.module_id as string
                const subject_id = filters.subject_id as string

                if (module_id) {
                    if (day || subject_id) {
                        conflicts = await database.distinct().select(["c.day", "c.time_id", "c.subject_id", "m.number as module", "u.name as professor", "u.id as professor_id"]).from("conflict as c").join("module as m", "m.id", "=", "c.module_id").join("user as u", "u.id", "=", "c.user_id").where({ "c.module_id": module_id }).andWhere(function () {
                            if (day)
                                this.where("c.day", "like", `${day}%`)
                            if (subject_id)
                                this.where({ "c.subject_id": subject_id })
                        })
                    } else {
                        conflicts = await database("conflict").where({ module_id })
                    }

                    response.status(200).json(conflicts)
                } else response.status(500).json({
                    code: 202,
                    message: "Preencha todos os campos: módulo."
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