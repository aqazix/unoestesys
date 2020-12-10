import Knex from "knex"

export const up = async (knex: Knex) => {
    return Promise.all([
        knex.schema.createTable("subject", table => {
            table.increments("id").primary()
            table.boolean("active").notNullable()
            table.date("creation").notNullable()
            table.string("duration").notNullable()
            table.string("name").notNullable()
        }).then(() => {
            return knex("subject").insert({
                active: true,
                creation: new Date(Date.now()).toISOString(),
                duration: 40,
                name: "Empreendedorismo"
            }).then(() => {
                return knex("subject").insert({
                    active: true,
                    creation: new Date(Date.now()).toISOString(),
                    duration: 80,
                    name: "Gestão de Pessoas"
                }).then(() => {
                    return knex("subject").insert({
                        active: true,
                        creation: new Date(Date.now()).toISOString(),
                        duration: 80,
                        name: "Língua Portuguesa"
                    }).then(() => {
                        return knex("subject").insert({
                            active: true,
                            creation: new Date(Date.now()).toISOString(),
                            duration: 80,
                            name: "Pedagogia Hospitalar"
                        }).then(() => {
                            return knex("subject").insert({
                                active: true,
                                creation: new Date(Date.now()).toISOString(),
                                duration: 80,
                                name: "Introdução à Engenharia de Software"
                            }).then(() => {
                                return knex("subject").insert({
                                    active: true,
                                    creation: new Date(Date.now()).toISOString(),
                                    duration: 40,
                                    name: "Ambientes Operacionais"
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
    return knex.schema.dropTable("subject")
}