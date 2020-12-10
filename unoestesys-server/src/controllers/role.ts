import { Request, Response } from "express"
import database from "../database/connection"

export default class Role {
    index = async (request: Request, response: Response) => {
        const filters = request.query

        let roles

        try {
            const title = filters.title as string
            const creation = filters.creation as string

            if (title || creation) {
                roles = await database("role").where({ active: true }).andWhere("id", "<>", "1").andWhere(function () {
                    if (title)
                        this.where("role.title", "like", `%${title}%`)
                    if (creation)
                        this.where({ creation })
                })
            } else {
                roles = await database("role").where({ active: true }).andWhere("id", "<>", "1")
            }

            response.status(200).json(roles)
        } catch (error) {
            response.status(500).json({
                code: 101,
                error,
                message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
            })
        }
    }

    show = async (request: Request, response: Response) => {
        const { id } = request.params

        let role

        try {
            role = await database("role").where({ active: true, id }).first()

            const { title, creation } = role

            response.status(200).json({ title, creation })
        } catch (error) {
            response.status(500).json({
                code: 101,
                error,
                message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
            })
        }
    }
}