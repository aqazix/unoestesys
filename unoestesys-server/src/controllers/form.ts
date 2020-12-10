import { Request, Response, NextFunction } from "express"
import database from "../database/connection"

export default class Form {
    create = async (request: Request, response: Response, next: NextFunction) => {
        const {
            banner,
            course,
            duration,
            init,
            title,
            lecturer,
            lecturerTitle,
            level,
            link,
            maxRegistration,
            partnership,
            sponsorship
        } = request.body

        const transaction = await database.transaction()

        try {
            const insert = await transaction("form").insert({
                active: true,
                creation: new Date(Date.now()),
                banner,
                course,
                duration,
                init,
                title,
                lecturer,
                lecturerTitle,
                level,
                link,
                maxRegistration,
                partnership,
                sponsorship,
            })

            await transaction.commit()

            response.locals.form_id = insert[0]

            response.status(201).send()

            next()
        } catch (error) {
            await transaction.rollback()

            response.status(500).json({ error })
        }
    }

    delete = async (request: Request, response: Response) => {
        const { id } = request.params

        const transaction = await database.transaction()

        try {
            await transaction("form").where({ id }).update({ "active": true })

            await transaction.commit()

            response.status(204).send()
        } catch (error) {
            await transaction.rollback()

            response.status(500).json({ error })
        }
    }

    index = async (request: Request, response: Response) => {
        const filters = request.query

        let forms

        try {
            const title = filters.title as string
            const lecturer = filters.lecturer as string
            const lecturerTitle = filters.lecturerTitle as string
            const course = filters.course as string
            const link = filters.link as string
            const maxRegistration = filters.maxRegistration as string
            const init = filters.init as string
            const duration = filters.duration as string
            const partnership = filters.partnership as string
            const sponsorship = filters.sponsorship as string
            const level = filters.level as string

            if (title || lecturer || lecturerTitle || course || link || maxRegistration || init || duration || partnership || sponsorship || level) {
                forms = await database("form").where({ "active": true }).andWhere(function () {
                    if (title)
                        this.where({ title })
                    if (lecturer)
                        this.where({ lecturer })
                    if (lecturerTitle)
                        this.where({ lecturerTitle })
                    if (course)
                        this.where({ course })
                    if (link)
                        this.where({ link })
                    if (maxRegistration)
                        this.where({ maxRegistration })
                    if (init)
                        this.where({ init })
                    if (duration)
                        this.where({ duration })
                    if (partnership)
                        this.where({ partnership })
                    if (sponsorship)
                        this.where({ sponsorship })
                    if (level)
                        this.where({ level })
                })
            } else {
                forms = await database("form").where({ "active": true })
            }

            response.status(200).json(forms)
        } catch (error) {
            response.status(500).json({ error })
        }
    }

    setForm = async (request: Request, response: Response) => {
        const form_id = response.locals.form_id
        const { user_id } = request.body

        const transaction = await database.transaction()

        try {
            await transaction("forms").insert({
                form_id,
                user_id
            })

            await transaction.commit()

            response.status(201).send()
        } catch (error) {
            await transaction.rollback()

            response.status(500).json({ error })
        }
    }

    show = async (request: Request, response: Response) => {
        const { id } = request.params

        let form

        try {
            form = await database("form").where({ id }).first()

            const { title, lecturer, lecturerTitle, course, link, maxRegistration, init, duration, partnership, sponsorship, level } = form

            response.status(200).json({ title, lecturer, lecturerTitle, course, link, maxRegistration, init, duration, partnership, sponsorship, level })
        } catch (error) {
            response.status(500).json({ error })
        }
    }

    update = async (request: Request, response: Response) => {
        const {
            banner,
            course,
            duration,
            id,
            init,
            lecturer,
            lecturerTitle,
            level,
            link,
            maxRegistration,
            partnership,
            sponsorship,
            title,
        } = request.body

        const transaction = await database.transaction()

        try {
            await transaction("form").where({ id }).modify(function () {
                if (banner)
                    this.update({ banner })
                if (course)
                    this.update({ course })
                if (duration)
                    this.update({ duration })
                if (init)
                    this.update({ init })
                if (title)
                    this.update({ title })
                if (lecturer)
                    this.update({ lecturer })
                if (lecturerTitle)
                    this.update({ lecturerTitle })
                if (level)
                    this.update({ level })
                if (link)
                    this.update({ link })
                if (maxRegistration)
                    this.update({ maxRegistration })
                if (partnership)
                    this.update({ partnership })
                if (sponsorship)
                    this.update({ sponsorship })
            })

            await transaction.commit()

            response.status(204).send()
        } catch (error) {
            await transaction.rollback()

            response.status(500).json({ error })
        }
    }
}