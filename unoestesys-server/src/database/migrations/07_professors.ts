import Knex from "knex"

export const up = async (knex: Knex) => {
    return Promise.all([
        knex.schema.createTable("professors", table => {
            table.boolean("current").notNullable()
            table.integer("subject_id").notNullable().references("id").inTable("subject")
            table.integer("user_id").notNullable().references("id").inTable("user")
            table.primary(["user_id", "subject_id"])
        }).then(() => {
            return knex("professors").insert({
                subject_id: 1,
                user_id: 2,
                current: true
            }).then(() => {
                return knex("professors").insert({
                    subject_id: 2,
                    user_id: 2,
                    current: true
                }).then(() => {
                    return knex("professors").insert({
                        subject_id: 3,
                        user_id: 3,
                        current: true
                    }).then(() => {
                        return knex("professors").insert({
                            subject_id: 3,
                            user_id: 2,
                            current: true
                        }).then(() => {
                            return knex("professors").insert({
                                subject_id: 4,
                                user_id: 3,
                                current: true
                            }).then(() => {
                                return knex("professors").insert({
                                    subject_id: 5,
                                    user_id: 4,
                                    current: true
                                }).then(() => {
                                    return knex("professors").insert({
                                        subject_id: 5,
                                        user_id: 2,
                                        current: false
                                    }).then(() => {
                                        return knex("professors").insert({
                                            subject_id: 6,
                                            user_id: 4,
                                            current: true
                                        }).then(() => {
                                            return knex("professors").insert({
                                                subject_id: 6,
                                                user_id: 3,
                                                current: true
                                            }).then(() => {
                                                return knex("professors").insert({
                                                    subject_id: 6,
                                                    user_id: 2,
                                                    current: false
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    ])
}

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("professors")
}