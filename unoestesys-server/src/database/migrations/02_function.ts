import Knex from "knex"

export const up = async (knex: Knex) => {
    return Promise.all([
        knex.schema.createTable("function", table => {
            table.increments("id").primary()
            table.boolean("active").notNullable()
            table.string("name").notNullable()
            table.boolean("wip").notNullable().defaultTo(false)
        }).then(() => {
            return knex("function").insert({
                active: true,
                name: "*",
                wip: false
            }).then(() => {
                return knex("function").insert({
                    active: true,
                    name: "Contratos",
                    wip: true
                }).then(() => {
                    return knex("function").insert({
                        active: true,
                        name: "Formulários",
                        wip: false
                    }).then(() => {
                        return knex("function").insert({
                            active: true,
                            name: "Perfil",
                            wip: false
                        }).then(() => {
                            return knex("function").insert({
                                active: true,
                                name: "WebChat",
                                wip: true
                            }).then(() => {
                                return knex("function").insert({
                                    active: true,
                                    name: "Webconferências",
                                    wip: false
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
    return knex.schema.dropTable("function")
}