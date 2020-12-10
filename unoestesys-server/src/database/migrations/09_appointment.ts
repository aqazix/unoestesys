import Knex from "knex"

export const up = async (knex: Knex) => {
    return knex.schema.createTable("appointment", table => {
        table.date("day").notNullable()
        table.integer("module_id").notNullable().references("id").inTable("module")
        table.integer("subject_id").notNullable().references("id").inTable("subject")
        table.integer("time_id").notNullable().references("id").inTable("time")
        table.integer("user_id").notNullable().references("id").inTable("user")
        table.primary(["day", "subject_id", "time_id", "user_id"])
    })
}

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("appointment")
}