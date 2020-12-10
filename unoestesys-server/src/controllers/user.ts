import { Request, Response, NextFunction, json } from "express"
import crypto from "crypto"
import fs from "fs"
import jwt from "jsonwebtoken"
import path from "path"
import nodemailer from "nodemailer"
import database from "../database/connection"
import { parseJWT } from "../utils/authorization"
import { hash } from "../utils/bcrypt"

let env = require("dotenv-safe").config()

export default class User {
    create = async (request: Request, response: Response) => {
        const {
            email,
            name,
            password,
            registry
        } = request.body

        if (email && name && password && registry) {
            hash(password).then(async hashedPassword => {
                const transaction = await database.transaction()

                try {
                    await transaction("user").insert({
                        active: true,
                        email,
                        name,
                        password: hashedPassword,
                        registry
                    })

                    await transaction.commit()

                    response.status(201).send()
                } catch (error) {
                    await transaction.rollback()

                    response.status(500).json({
                        code: 101,
                        error,
                        message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                    })
                }
            }).catch(error => {
                response.status(500).json({
                    code: 101,
                    error,
                    message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                })
            })
        }
        else response.status(500).json({
            code: 202,
            message: "Preencha todos os campos."
        })
    }

    delete = async (request: Request, response: Response) => {
        const { id } = request.params

        const transaction = await database.transaction()

        const token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id === 1) {
            if (!isNaN(parseInt(id))) {
                try {
                    if (id !== "1") {
                        await transaction("user").where({ id }).update({ active: false })

                        await transaction.commit()

                        response.status(204).send()
                    } else {
                        await transaction.rollback()

                        response.status(500).json({
                            code: 300,
                            message: "A operação desejada não é permitida."
                        })
                    }
                } catch (error) {
                    await transaction.rollback()

                    response.status(500).json({
                        code: 101,
                        error,
                        message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                    })
                }
            } else response.status(500).json({
                code: 101,
                message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
            })
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    index = async (request: Request, response: Response) => {
        const filters = request.query

        let users

        const token = request.headers.authorization?.split("Bearer ")[1]

        const { role_id } = parseJWT(token ? token : "")

        if (role_id < 3) {
            try {
                const name = filters.name as string
                const registry = filters.registry as string
                const email = filters.email as string
                const role_id = filters.role_id as string

                if (name || registry || email || role_id) {
                    users = await database("user").where({ active: true }).andWhere(function () {
                        if (name)
                            this.where({ name })
                        if (registry)
                            this.where({ registry })
                        if (email)
                            this.where({ email })
                        if (role_id)
                            this.where({ role_id })
                    })
                } else {
                    users = await database("user").where({ active: true })
                }

                Promise.all(users.map(async user => {
                    delete user.active
                    delete user.avatar
                    delete user.token
                    delete user.password
                    if (user.role_id) {
                        const role = await database("role").where({ id: user.role_id }).first()
                        user.title = role.title
                    }
                    return user
                })).then(users => {
                    response.status(200).json(users)
                })
            } catch (error) {
                response.status(500).json({
                    code: 100,
                    error,
                    message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    manage = async (request: Request, response: Response) => {
        const {
            email,
            name,
            registry,
            role_id
        } = request.body

        const transaction = await database.transaction()

        const token = request.headers.authorization?.split("Bearer ")[1]

        const user_role_id = parseJWT(token ? token : "").role_id

        if (user_role_id === 1) {
            try {
                crypto.randomBytes(20, (error, buffer) => {
                    hash(buffer.toString("hex")).then(async password => {
                        await transaction("user").insert({
                            active: true,
                            email,
                            name,
                            password,
                            registry,
                            role_id
                        })

                        let transport = nodemailer.createTransport({
                            host: "smtp.office365.com",
                            port: 587,
                            secure: false,
                            auth: {
                                user: process.env.SMTPEMAIL,
                                pass: process.env.SMTPPASSWORD
                            }
                        })

                        await transport.sendMail({
                            from: `"UnoesteSYS"<${process.env.SMTPEMAIL}>`,
                            to: email,
                            subject: "Conta UnoesteSYS",
                            html: `<p>Bom dia.<br/>Sua conta no sistema UnoesteSYS foi criada. Segue abaixo seus dados de acesso:<br/>Login: ${email}<br/>Senha: ${buffer.toString("hex")}<br/><br/>Você pode acessar o sistema através <a href='http://localhost:3000' target='_blank' rel='noopener noreferrer'><b><u>deste link</u></b></a>. Sugerimos que troque a senha para uma de sua preferência.<br/><br/>Até mais!<br/>UnoesteSYS</p>`
                        })

                        await transaction.commit()

                        response.status(201).send()
                    }).catch(async error => {
                        await transaction.rollback()
                        console.log(error)

                        response.status(500).json({
                            code: 101,
                            error,
                            message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                        })
                    })
                })
            } catch (error) {
                await transaction.rollback()

                response.status(500).json({
                    code: 101,
                    error,
                    message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }

    recover = async (request: Request, response: Response) => {
        const { token } = request.params

        const { password } = request.body

        const transaction = await database.transaction()

        try {
            const { id, exp } = parseJWT(token)

            if (Date.now() < exp * 1000) {
                const user = await transaction("user").where({ id }).first()

                if (user) {
                    hash(password).then(async (password: string) => {
                        await transaction("user").where({ id }).update({
                            password,
                            token: null
                        })

                        await transaction.commit()

                        response.status(204).send()
                    }).catch(async error => {
                        await transaction.rollback()

                        response.status(500).json({
                            code: 101,
                            error,
                            message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                        })
                    })
                } else {
                    await transaction.rollback()

                    response.status(500).json({
                        code: 101,
                        message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                    })
                }
            } else {
                await transaction.rollback()

                response.status(500).json({
                    error: 203,
                    message: "A chave de recuperação de senha expirou."
                })
            }
        } catch (error) {
            await transaction.rollback()

            response.status(500).json({
                code: 201,
                error,
                message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
            })
        }
    }

    saveImage = async (request: Request, response: Response) => {
        const {
            id,
            avatar
        } = request.body

        if (response.locals.avatar) {
            const transaction = await database.transaction()

            try {
                const dir = path.join(__dirname, "..", "..", "public")

                let image = avatar.split(";base64,").pop()
                fs.writeFileSync(path.join(dir, id + ".png"), image, { encoding: "base64" })

                let avatarPath = id + ".png"

                await transaction("user").where({ id }).update({ avatar: avatarPath })

                await transaction.commit()

                response.status(200).send()
            } catch (error) {
                await transaction.rollback()

                response.status(500).json({
                    code: 101,
                    error,
                    message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                })
            }
        } else response.status(200).send()
    }

    sendRecover = async (request: Request, response: Response) => {
        const {
            email
        } = request.body

        const transaction = await database.transaction()

        try {
            const user = await transaction("user").where({ email }).first()

            if (user) {
                const token = jwt.sign({ id: user.id }, process.env.SECRET, {
                    expiresIn: 3600
                })

                await transaction("user").where({ id: user.id }).update({ token })

                let transport = nodemailer.createTransport({
                    host: "smtp.office365.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTPEMAIL,
                        pass: process.env.SMTPPASSWORD
                    }
                })

                try {
                    await transport.sendMail({
                        from: `"UnoesteSYS"<${process.env.SMTPEMAIL}>`,
                        to: email,
                        subject: "Recuperar a senha",
                        html: `<p>Bom dia.<br/>Estamos mandando este e-mail porque foi solicitada a recuperação da senha associada a este e-mail no <a href='http://localhost:3000' target='_blank' rel='noopener noreferrer'><b><u>UnoesteSYS</u></b></a>.<br/><br/>Se você não solicitou esta troca, desconsidere este e-mail. Do contrário, clique <a href='http://localhost:3000/recover-password/${token}' target='_blank' rel='noopener noreferrer'><b><u>aqui</u></b></a>.<br/><br/>Até mais!<br/>UnoesteSYS</p>`
                    })

                    await transaction.commit()

                    response.status(204).send()
                } catch (error) {
                    throw {
                        code: 100,
                        message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                    }
                }
            } else {
                response.status(500).json({
                    code: 201,
                    message: "Não há usuários cadastrados com esse e-mail."
                })
            }
        } catch (error) {
            await transaction.rollback()

            response.status(500).json(error)
        }
    }

    show = async (request: Request, response: Response) => {
        const { id } = request.params

        let user

        try {
            user = await database("user").where({ id }).andWhere({ active: true }).first()

            const { avatar, email, name, registry, role_id } = user

            let role
            let title

            if (role_id !== null) {
                role = await database("role").andWhere({ id: role_id }).first()
                title = role.title
            }

            response.status(200).json({ avatar, email, name, registry, role_id, title })
        } catch (error) {
            response.status(500).json({
                code: 101,
                error,
                message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
            })
        }
    }

    update = async (request: Request, response: Response, next: NextFunction) => {
        const {
            id,
            avatar,
            password,
            name
        } = request.body

        const transaction = await database.transaction()

        try {
            if (avatar)
                response.locals.avatar = true

            if (name)
                await transaction("user").where({ id }).update({ name })
            if (password)
                await hash(password).then(async password => {
                    await transaction("user").where({ id }).update({ password })
                })

            await transaction.commit()

            next()
        } catch (error) {
            await transaction.rollback()

            response.status(500).json({
                code: 100,
                error,
                message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
            })
        }
    }

    updateRole = async (request: Request, response: Response) => {
        const {
            id,
            role_id
        } = request.body

        const token = request.headers.authorization?.split("Bearer ")[1]

        const user_role_id = parseJWT(token ? token : "").role_id

        const transaction = await database.transaction()

        if (user_role_id === 1) {
            try {
                await transaction("user").where({ id }).update({ role_id })

                await transaction.commit()

                response.status(204).send()
            } catch (error) {
                await transaction.rollback()

                response.status(500).json({
                    code: 101,
                    error,
                    message: "Não foi possível realizar a operação. Por favor, tente novamente mais tarde."
                })
            }
        } else response.status(401).json({
            code: 300,
            message: "A operação desejada não é permitida."
        })
    }
}