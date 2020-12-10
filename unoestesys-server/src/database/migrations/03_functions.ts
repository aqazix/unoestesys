import Knex from "knex"

export const up = async (knex: Knex) => {
    return Promise.all([
        knex.schema.createTable("functions", table => {
            table.integer("function_id").notNullable().references("id").inTable("function")
            table.integer("role_id").notNullable().references("id").inTable("role")
            table.primary(["role_id", "function_id"])
        }).then(() => {
            return knex("functions").insert({
                function_id: 1,
                role_id: 1
            }).then(() => {
                return knex("functions").insert({
                    function_id: 2,
                    role_id: 2
                }).then(() => {
                    return knex("functions").insert({
                        function_id: 3,
                        role_id: 2
                    }).then(() => {
                        return knex("functions").insert({
                            function_id: 4,
                            role_id: 2
                        }).then(() => {
                            return knex("functions").insert({
                                function_id: 5,
                                role_id: 2
                            }).then(() => {
                                return knex("functions").insert({
                                    function_id: 4,
                                    role_id: 3
                                }).then(() => {
                                    return knex("functions").insert({
                                        function_id: 5,
                                        role_id: 3
                                    }).then(() => {
                                        return knex("functions").insert({
                                            function_id: 6,
                                            role_id: 3
                                        })
                                    })
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
    return knex.schema.dropTable("functions")
}