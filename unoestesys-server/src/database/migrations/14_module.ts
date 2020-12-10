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
                dateBegin: "2020-08-02",
                dateEnd: "2020-08-31",
                current: true
            }).then(() => {
                return knex("module").insert({
                    number: 2,
                    dateBegin: "2020-09-02",
                    dateEnd: "2020-09-30",
                    current: true
                }).then(() => {
                    return knex("module").insert({
                        number: 3,
                        dateBegin: "2020-10-02",
                        dateEnd: "2020-10-31",
                        current: true
                    }).then(() => {
                        return knex("module").insert({
                            number: 4,
                            dateBegin: "2020-11-02",
                            dateEnd: "2020-11-30",
                            current: true
                        }).then(() => {
                            return knex("module").insert({
                                number: 5,
                                dateBegin: "2020-08-02",
                                dateEnd: "2020-09-30",
                                current: true
                            }).then(() => {
                                return knex("module").insert({
                                    number: 6,
                                    dateBegin: "2020-10-02",
                                    dateEnd: "2020-11-30",
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