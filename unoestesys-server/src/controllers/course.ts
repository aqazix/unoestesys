import { Request, Response } from "express"
import database from "../database/connection"
import { parseJWT } from "../utils/authorization"

export default class Course {
    create = async (request: Request, response: Response) => {
        const {
            name,
            coordinator_id
        } = request.body

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 3) {
            try {
                await transaction("course").insert({
                    name,
                    coordinator_id,
                    creation: new Date(Date.now()).toLocaleDateString(),
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
                await transaction("course").where({ id }).update({ active: false })

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

        let courses

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                const coordinator_id = filters.coordinator_id as string
                const creation = filters.creation as string
                const name = filters.name as string
                const user_id = filters.user_id as string
    
                if (user_id) {
                    courses = await database.distinct().select(["c.id", "c.name", "c.coordinator_id"]).from("course as c").join("subjects as ss", "ss.course_id", "=", "c.id").join("subject as s", "ss.subject_id", "=", "s.id").join("professors as p", "p.subject_id", "=", "s.id").where({ "p.user_id": user_id }).andWhere({ "c.active": true })
                } else if (coordinator_id || creation || name) {
                    courses = await database.select(["c.id", "c.name", "c.coordinator_id", "u.name as coordinator"]).distinct("c.id").from("course as c").join("user as u", "c.coordinator_id", "=", "u.id").where({ "c.active": true }).andWhere(function () {
                        if (coordinator_id)
                            this.where({ "c.coordinator_id": coordinator_id })
                        if (creation)
                            this.where({ "c.creation": creation })
                        if (name)
                            this.where("c.name", "like", `%${name}%`)
                        if (user_id)
                            this.where("c.user_id", "=", user_id)
                    }).orderBy("c.name")
                } else {
                    courses = await database.select(["c.id", "c.name", "c.coordinator_id", "u.name as coordinator"]).distinct("c.id").from("course as c").join("user as u", "c.coordinator_id", "=", "u.id").where({ "c.active": true }).orderBy("c.name")
    
                    courses.forEach(course => {
                        delete course.active
                        delete course.creation
                    })
                }
    
                response.status(200).json(courses)
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

        let course

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                course = await database("course").where({ active: true, id }).first()
    
                const { name, creation, coordinator_id } = course
    
                const subjects = await database.select(["s.id", "s.name", "s.duration"]).from("subject as s").join("subjects as ss", "ss.subject_id", "=", "s.id").where("ss.course_id", "=", id).andWhere("s.active", "=", true).orderBy("s.name")
    
                response.status(200).json({ name, creation, coordinator_id, subjects })
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
            name,
            coordinator_id
        } = request.body

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id === 1) {
            try {
                await transaction("course").where({ id }).modify(function () {
                    if (name)
                        this.update({ name })
                    if (coordinator_id)
                        this.update({ coordinator_id })
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