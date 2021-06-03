require("dotenv/config")
import cors from "cors"
import express from "express"
import http from "http"
import path from "path"
import routes from "./routes"

const dir = path.join(__dirname, "..", "public")
let server: http.Server

export const initialize = () => {
    return new Promise((resolve, reject) => {
        const app = express()
        app.use(cors())
        app.use(express.json({ limit: "5mb" }))
        app.use(express.static(dir))
        app.use(routes)

        server = http.createServer(app)

        server.listen(process.env.PORT || 3333).on("listening", () => {
            resolve(null)
        }).on("error", error => {
            reject(error)
        })
    })
}

export const close = () => {
    return new Promise((resolve, reject) => {
        server.close(error => {
            if (error) {
                reject(error)
                return
            }
            resolve(null)
        })
    })
}