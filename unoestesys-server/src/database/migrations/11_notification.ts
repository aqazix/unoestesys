import Knex from "knex"

export const up = (knex: Knex) => {
    return knex.schema.createTable("notification", table => {
        table.increments("id").primary()
        table.date("day").defaultTo(null)
        table.integer("type").notNullable()
        table.integer("module_id").references("id").inTable("subject").defaultTo(null)
        table.integer("subject_id").references("id").inTable("subject").defaultTo(null)
        table.integer("time_id").references("id").inTable("time").defaultTo(null)
        table.integer("user_id").notNullable().references("id").inTable("user")
    })
}

export const down = (knex: Knex) => {
    return knex.schema.dropTable("notification")
}