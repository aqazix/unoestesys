import { Request, Response, NextFunction } from "express"
import database from "../database/connection"
import { parseJWT } from "../utils/authorization"

export default class Appointment {
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
                    let appointment = await transaction("appointment").where({
                        day,
                        time_id
                    })

                    if (appointment.length > 0) { // There's an appointment in this date/time
                        appointment = appointment.filter(appointment => appointment.user_id === user_id)

                        if (appointment.length > 0) { // There's an appointment in this date/time from the user trying to schedule it
                            await transaction.rollback()

                            response.status(500).json({
                                code: 204,
                                message: "Este professor já possui uma webconferência agendada nesse horário."
                            })
                        } else { // There's not an appointment in this date/time from the user trying to schedule it
                            await transaction.rollback()

                            next()
                        }
                    } else { // There's not an appointment in this date/time
                        await transaction("appointment").insert({
                            day,
                            module_id,
                            subject_id,
                            time_id,
                            user_id
                        })

                        await transaction.commit()

                        response.status(201).send()
                    }
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

    delete = async (request: Request, response: Response) => {
        const {
            day,
            time_id,
            user_id
        } = request.body

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                await transaction("appointment").where({
                    day,
                    time_id,
                    user_id
                }).del()

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

        let appointments

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                const day = filters.day as string
                const module_id = filters.module_id as string
                const subject_id = filters.subject_id as string

                if (module_id) {
                    if (day || subject_id) {
                        appointments = await database.distinct().select(["a.day", "a.time_id", "a.subject_id", "m.number as module", "u.name as professor", "u.id as professor_id"]).from("appointment as a").join("module as m", "m.id", "=", "a.module_id").join("user as u", "u.id", "=", "a.user_id").andWhere({ "a.module_id": module_id }).andWhere(function () {
                            if (day)
                                this.where("a.day", "like", `${day}%`)
                            if (subject_id)
                                this.where({ "a.subject_id": subject_id })
                        })
                    } else {
                        appointments = await database.select("day").from("appointment").andWhere({ module_id })
                    }

                    response.status(200).json(appointments)
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

    show = async (request: Request, response: Response) => {
        const { id } = request.params

        let appointment

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                appointment = await database("appointment").where({ id }).first()

                const { day, time_id, subject_id } = appointment

                response.status(200).json({ day, time_id, subject_id })
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

    update = async (request: Request, response: Response, next: NextFunction) => {
        const {
            day,
            prev,
            module_id,
            subject_id,
            time_id,
            user_id
        } = request.body

        let transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            if (day && subject_id) {
                try {
                    await transaction("appointment").where({
                        day,
                        time_id: prev,
                        user_id
                    }).del()

                    await transaction.commit()

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
                if (!subject_id)
                    array.push("disciplina")

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
}
