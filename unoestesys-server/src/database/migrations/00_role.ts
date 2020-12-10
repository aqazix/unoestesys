import Knex from "knex"

export const up = async (knex: Knex) => {
    return Promise.all([
        knex.schema.createTable("role", table => {
            table.increments("id").primary()
            table.boolean("active").notNullable()
            table.date("creation").notNullable()
            table.string("title").notNullable()
        }).then(() => {
            return knex("role").insert({
                active: true,
                creation: new Date(Date.now()),
                title: "Administradxr"
            }).then(() => {
                return knex("role").insert({
                    active: true,
                    creation: new Date(Date.now()),
                    title: "Funcionárix"
                }).then(() => {
                    return knex("role").insert({
                        active: true,
                        creation: new Date(Date.now()),
                        title: "Professxr"
                    })
                })
            })
        })
    ])
}

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("role")
}