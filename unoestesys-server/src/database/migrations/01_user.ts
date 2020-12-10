import Knex from "knex"

export const up = async (knex: Knex) => {
    return Promise.all([
        knex.schema.createTable("user", table => {
            table.increments("id").primary()
            table.boolean("active").notNullable()
            table.string("avatar")
            table.string("email").unique().notNullable()
            table.string("name").notNullable()
            table.string("password").notNullable()
            table.string("registry").notNullable()
            table.string("token")
            table.integer("role_id").references("id").inTable("role")
        }).then(() => {
            knex("user").insert({
                active: true,
                email: "admin@unoeste.br",
                name: "admin",
                password: "$2b$10$5iM/o9XJDazTH6gdn4zsf.ay6Wo6Z3.K7MGFr1VTURT4IMrkgYXF6",
                registry: "0",
                role_id: 1
            }).then(() => {
                return knex("user").insert({
                    active: true,
                    email: "professorteste1@unoeste.br",
                    name: "Professor Teste 1",
                    password: "$2b$10$FcL3Zojn6BIpOSIaO76BCOK/uuRqZ/hDQ.cjORRNPpQbJ4J4TYvxi",
                    registry: "1",
                    role_id: 3
                }).then(() => {
                    return knex("user").insert({
                        active: true,
                        email: "professorteste2@unoeste.br",
                        name: "Professor Teste 2",
                        password: "$2b$10$82BdBCvtY8.EJAVjIhYrsO/1rzRxja/NNYF/GiGQlpMPm9kjKj3Li",
                        registry: "2",
                        role_id: 3
                    }).then(() => {
                        return knex("user").insert({
                            active: true,
                            email: "professorteste3@unoeste.br",
                            name: "Professor Teste 3",
                            password: "$2b$10$Tm8alGdZq1T1ynFmbJN7cuKIm9Ff9UHD8kdEW.Uy6i6s7uKi47GKq",
                            registry: "3",
                            role_id: 3
                        })
                    })
                })
            })
        })
    ])
}

export const down = async (knex: Knex) => {
    return knex.schema.dropTable("user")
}