import { Request, Response, request } from "express"
import database from "../database/connection"
import { parseJWT } from "../utils/authorization"

export default class Time {
    create = async (request: Request, response: Response) => {
        const {
            hour,
            saturday
        } = request.body

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 3) {
            try {
                await transaction("time").insert({
                    hour,
                    saturday,
                    active: true
                })

                await transaction.commit()

                response.status(201).send()
            } catch (error) {
                await transaction.rollback()

                response.status(500).json({ error })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    delete = async (request: Request, response: Response) => {
        const { id } = request.params

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id === 1) {
            try {
                await transaction("time").where({ id }).update({ "active": false })

                await transaction.commit()

                response.status(204).send()
            } catch (error) {
                await transaction.rollback()

                response.status(500).json({ error })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    index = async (request: Request, response: Response) => {
        const filters = request.query

        let times

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                const hour = filters.hour as string
                const saturday = filters.saturday as string
    
                if (hour || saturday) {
                    times = await database("time").where({ active: true }).andWhere(function () {
                        if (hour)
                            this.where({ hour })
                        if (saturday)
                            this.where({ saturday })
                    })
                } else {
                    times = await database("time").where({ active: true })
                }
    
                response.status(200).json(times)
            } catch (error) {
                response.status(500).json({ error })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    show = async (request: Request, response: Response) => {
        const { id } = request.params

        let time

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                time = await database("time").where({ active: true, id }).first()
    
                const { hour, saturday } = time
    
                response.status(200).json({ hour, saturday })
            } catch (error) {
                response.status(500).json({ error })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    update = async (request: Request, response: Response) => {
        const {
            id,
            hour,
            saturday
        } = request.body

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 3) {
            try {
                await transaction("time").where({ id }).modify(function () {
                    if (hour)
                        this.update({ hour })
                    if (saturday)
                        this.update({ saturday })
                })

                await transaction.commit()

                response.status(204).send()
            } catch (error) {
                await transaction.rollback()

                response.status(500).json({ error })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }
}