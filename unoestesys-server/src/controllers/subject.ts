import { Request, Response, NextFunction } from "express"
import database from "../database/connection"
import { parseJWT } from "../utils/authorization"

export default class subject {
    changeProfessors = async (request: Request, response: Response) => {
        const {
            id,
            professors
        } = request.body

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 3) {
            if (professors) {
                const transaction = await database.transaction()

                try {
                    const professorsDB = await transaction("professors").where({ subject_id: id })

                    Promise.all(professorsDB.map(async professor => {
                        const active = professorsDB.filter(professor => professor.current).length
                        if (professors.includes(professor.user_id)) {
                            if (active < 2) {
                                professor.current = true
                                await transaction("professors").where({ subject_id: id }).andWhere({ user_id: professor.user_id }).update({ current: true })
                            }
                        } else if (active > 1) {
                            professor.current = false
                            await transaction("professors").where({ subject_id: id }).andWhere({ user_id: professor.user_id }).update({ current: false })
                        }
                    })).then(() => {
                        Promise.all(professors.map(async (user_id: Number) => {
                            const index = professorsDB.findIndex(professor => professor.user_id === user_id)
                            const length = professorsDB.filter(professor => professor.current).length

                            if (index === -1 && length < 2)
                                return await transaction("professors").insert({
                                    subject_id: id,
                                    user_id,
                                    current: true
                                })
                        })).then(async () => {
                            await transaction.commit()

                            response.status(204).send()
                        })
                    })
                } catch (error) {
                    await transaction.rollback()

                    response.status(500).json({ error })
                }
            } else response.status(204).send()
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    create = async (request: Request, response: Response) => {
        const {
            name,
            duration,
            professors,
            course_id
        } = request.body

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 3) {
            try {
                const subject_id = await transaction("subject").insert({
                    name,
                    creation: new Date(Date.now()).toLocaleDateString(),
                    duration,
                    active: true
                })

                let ids: number[] = []

                professors.forEach(async (user_id: Number) => {
                    let insert = await transaction("professors").insert({
                        subject_id,
                        user_id,
                        current: true
                    })

                    ids.push(insert[0])
                })

                await transaction("subjects").insert({
                    subject_id,
                    course_id
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

    delete = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id === 1) {
            try {
                await transaction("subject").where({ id }).update({ "active": false })

                await transaction("professors").where({ subject_id: id }).update({ current: false })

                await transaction.commit()

                next()
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

        let subjects

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                const name = filters.name as string
                const creation = filters.creation as string
                const duration = filters.duration as string
                const course_id = filters.course_id as string
                const user_id = filters.user_id as string
    
                if (user_id || course_id) {
                    subjects = await database.distinct().select(["s.id", "s.name", "s.duration"]).from("subject as s").join("subjects as ss", "ss.subject_id", "=", "s.id").join("professors as p", "p.subject_id", "s.id").where({ "s.active": true }).modify(function () {
                        if (user_id)
                            this.where("p.user_id", "=", user_id)
                        if (course_id)
                            this.where("ss.course_id", "=", course_id)
                    })
    
                    response.status(200).json(subjects)
                } else {
                    if (name || creation || duration) {
                        subjects = await database("subject").where({ active: true }).andWhere(function () {
                            if (name)
                                this.where("subject.name", "like", `%${name}%`)
                            if (creation)
                                this.where("subject.creation", "=", creation)
                            if (duration)
                                this.where("subject.duration", "=", duration)
                        })
                    } else {
                        subjects = await database("subject").where({ "active": true })
                    }
    
                    const result = subjects.map(async subject => {
                        const professors = await database.select("u.name", "u.id").from("subject as s").join("professors as p", "s.id", "=", "p.subject_id").join("user as u", "u.id", "=", "p.user_id").where("s.id", "=", subject.id).andWhere("p.current", "=", true)
                        const course = await database.select("c.name").from("subject as s").join("subjects as su", "s.id", "=", "su.subject_id").join("course as c", "su.course_id", "=", "c.id").where("s.id", "=", subject.id).andWhere("c.active", "=", true).first()
                        delete subject.active
                        delete subject.creation
                        return {
                            ...subject,
                            professors,
                            course: course.name
                        }
                    })
    
                    Promise.all(result).then(completed => response.status(200).json(completed))
                }
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

        let subject: {
            id: number,
            name: string,
            creation: string,
            duration: number,
            professors: any[]
        }

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 4) {
            try {
                subject = await database("subject").where({ active: true }).andWhere({ id }).first()
    
                const professors = await database("subject as s").join("professors as p", "p.user_id", "=", "s.id").where({ "subject_id": id })
    
                subject.professors = professors
    
                response.status(200).json({ ...subject })
            } catch (error) {
                response.status(500).json({ error })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    update = async (request: Request, response: Response, next: NextFunction) => {
        const {
            id,
            name,
            duration
        } = request.body

        const transaction = await database.transaction()

        let token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id === 1) {
            try {
                if (name)
                    await transaction("subject").where({ id }).update({ name })
                if (duration)
                    await transaction("subject").where({ id }).update({ duration })

                await transaction.commit()

                next()
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
