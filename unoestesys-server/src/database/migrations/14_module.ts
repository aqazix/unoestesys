import Knex from "knex"

export const up = async (knex: Knex) => {
    return Promise.all([
        knex.schema.createTable("module", table => {
            table.increments("id").primary()
            table.boolean("current").notNullable()
            table.date("dateBegin").notNullable()
            table.date("dateEnd").notNullable()
            table.integer("number").notNullable()
        }).then(() => {
            return knex("module").insert({
                number: 1,
                dateBegin: "2021-06-01",
                dateEnd: "2021-06-30",
                current: true
            }).then(() => {
                return knex("module").insert({
                    number: 2,
                    dateBegin: "2021-07-01",
                    dateEnd: "2021-07-31",
                    current: true
                }).then(() => {
                    return knex("module").insert({
                        number: 3,
                        dateBegin: "2021-08-01",
                        dateEnd: "2021-08-31",
                        current: true
                    }).then(() => {
                        return knex("module").insert({
                            number: 4,
                            dateBegin: "2021-09-01",
                            dateEnd: "2021-09-30",
                            current: true
                        }).then(() => {
                            return knex("module").insert({
                                number: 5,
                                dateBegin: "2021-06-01",
                                dateEnd: "2021-07-31",
                                current: true
                            }).then(() => {
                                return knex("module").insert({
                                    number: 6,
                                    dateBegin: "2021-08-01",
                                    dateEnd: "2021-09-30",
                                    current: true
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
    return knex.schema.dropTable("module")
}