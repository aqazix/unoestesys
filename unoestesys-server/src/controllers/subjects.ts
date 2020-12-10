import { Request, Response } from "express"
import database from "../database/connection"

export default class Subjects {
    addSubject = async (request: Request, response: Response) => {
        const {
            course_id,
            subjects
        } = request.body

        const transaction = await database.transaction()

        try {
            subjects.forEach(async (subject_id: Number) => {
                await transaction("subjects").insert({
                    course_id,
                    subject_id
                })
            })

            await transaction.commit()

            response.status(204).send()
        } catch (error) {
            await transaction.rollback()

            response.status(500).json({ error })
        }
    }

    deleteSubject = async (request: Request, response: Response) => {
        const filters = request.query
        const course_id = Number(filters.course_id)
        const subject_id = Number(filters.subject_id)

        const transaction = await database.transaction()

        try {
            await transaction("subjects").where({ course_id, subject_id }).del()

            await transaction.commit()

            response.status(204).send()
        } catch (error) {
            await transaction.rollback()

            response.status(500).json({ error })
        }
    }
}