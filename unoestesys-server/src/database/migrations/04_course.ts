import Knex from "knex"

export const up = (knex: Knex) => {
    return Promise.all([
        knex.schema.createTable("course", table => {
            table.increments("id").primary()
            table.boolean("active").notNullable()
            table.date("creation")
            table.string("name").notNullable()
            table.integer("coordinator_id").notNullable().references("id").inTable("user")
        }).then(() => {
            return knex("course").insert({
                active: true,
                creation: new Date(Date.now()),
                name: "Administração",
                coordinator_id: 2
            }).then(() => {
                return knex("course").insert({
                    active: true,
                    creation: new Date(Date.now()),
                    name: "Pedagogia",
                    coordinator_id: 3
                }).then(() => {
                    return knex("course").insert({
                        active: true,
                        creation: new Date(Date.now()),
                        name: "Engenharia de Software",
                        coordinator_id: 4
                    })
                })
            })
        })
    ])
}

export const down = (knex: Knex) => {
    return knex.schema.dropTable("course")
}