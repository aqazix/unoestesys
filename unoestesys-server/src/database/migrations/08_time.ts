import Knex from "knex"

export const up = async (knex: Knex) => {
    return Promise.all([
        knex.schema.createTable("time", table => {
            table.increments("id").primary()
            table.boolean("active").notNullable()
            table.string("hour").notNullable()
            table.boolean("saturday").notNullable()
        }).then(() => {
            return knex("time").insert({
                active: true,
                hour: "19:00",
                saturday: false
            }).then(() => {
                return knex("time").insert({
                    active: true,
                    hour: "20:30",
                    saturday: false
                }).then(() => {
                    return knex("time").insert({
                        active: true,
                        hour: "08:00",
                        saturday: true
                    }).then(() => {
                        return knex("time").insert({
                            active: true,
                            hour: "10:20",
                            saturday: true
                        })
                    })
                })
            })
        })
    ])
}

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("time")
}