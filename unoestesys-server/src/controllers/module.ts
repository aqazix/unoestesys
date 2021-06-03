import { Request, Response } from "express"
import database from "../database/connection"
import { parseJWT } from "../utils/authorization"

export default class Module {
    index = async (request: Request, response: Response) => {
        const filters = request.query

        let modules

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                const number = filters.number as string
                const dateBegin = filters.dateBegin as string
                const dateEnd = filters.dateEnd as string
    
                if (number || dateBegin || dateEnd) {
                    modules = await database("module").where({ current: true }).andWhere(function () {
                        if (number)
                            this.where({ number })
                        if (dateBegin)
                            this.where("dateBegin", "like", `%${dateBegin}%`)
                        if (dateEnd)
                            this.where("dateEnd", "like", `%${dateEnd}%`)
                    }).orderBy("number")
                } else {
                    modules = await database("module").where({ current: true }).orderBy("number")
                }
    
                response.status(200).json(modules)
            } catch (error) {
                response.status(500).json(error)
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    show = async (request: Request, response: Response) => {
        const { number } = request.params

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                const module = await database("module").where({ current: true }).andWhere({ number }).first()
    
                response.status(200).json(module)
            } catch (error) {
                response.status(500).json(error)
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    update = async (request: Request, response: Response) => {
        const {
            id,
            number,
            dateBegin,
            dateEnd
        } = request.body

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 3) {
            try {
                await transaction("module").where({ id }).update({ current: false })

                await transaction("appointment").where({ module_id: id }).del()

                await transaction("module").insert({
                    number,
                    dateBegin,
                    dateEnd,
                    current: true
                })

                await transaction.commit()

                response.status(204).send()
            } catch (error) {
                await transaction.rollback()

                response.status(500).json(error)
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }
}