import Knex from "knex"

export const up = async (knex: Knex) => {
    return knex.schema.createTable("form", table => {
        table.increments("id").primary()
        table.boolean("active").notNullable()
        table.string("banner").notNullable()
        table.string("course").notNullable()
        table.string("duration").notNullable()
        table.timestamp("init").defaultTo(knex.raw("CURRENT_TIMESTAMP")).notNullable()
        table.string("lecturer").notNullable()
        table.string("lecturerTitle").notNullable()
        table.integer("level").notNullable()
        table.string("link").notNullable()
        table.dateTime("maxRegistration").notNullable()
        table.string("partnership").notNullable()
        table.string("sponsorship").notNullable()
        table.string("title").notNullable()
    })
}

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("form")
}