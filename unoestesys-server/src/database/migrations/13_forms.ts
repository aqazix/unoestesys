import Knex from "knex"

export const up = async (knex: Knex) => {
    return knex.schema.createTable("forms", table => {
        table.integer("form_id").notNullable().references("id").inTable("form")
        table.integer("user_id").notNullable().references("id").inTable("user")
        table.primary(["user_id", "form_id"])
    })
}

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("forms")
}