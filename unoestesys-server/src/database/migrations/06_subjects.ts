import Knex from "knex"

export const up = (knex: Knex) => {
    return Promise.all([
        knex.schema.createTable("subjects", table => {
            table.integer("course_id").notNullable().references("id").inTable("course")
            table.integer("subject_id").notNullable().references("id").inTable("subject")
            table.primary(["course_id", "subject_id"])
        }).then(() => {
            return knex("subjects").insert({
                course_id: 1,
                subject_id: 1
            }).then(() => {
                return knex("subjects").insert({
                    course_id: 1,
                    subject_id: 2
                }).then(() => {
                    return knex("subjects").insert({
                        course_id: 2,
                        subject_id: 3
                    }).then(() => {
                        return knex("subjects").insert({
                            course_id: 2,
                            subject_id: 4
                        }).then(() => {
                            return knex("subjects").insert({
                                course_id: 3,
                                subject_id: 5
                            }).then(() => {
                                return knex("subjects").insert({
                                    course_id: 3,
                                    subject_id: 6
                                })
                            })
                        })
                    })
                })
            })
        })
    ])
}

export const down = (knex: Knex) => {
    return knex.schema.dropTable("subjects")
}