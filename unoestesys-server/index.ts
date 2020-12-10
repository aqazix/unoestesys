import { close, initialize } from "./src/server"

const startup = async () => {
    try {
        await initialize()
    } catch (error) {
        console.error(error)

        process.exit(1)
    }
}

const shutdown = async (e?: Error) => {
    let error = e

    try {
        await close()
    } catch (e) {
        console.log("Encountered an error: " + e)
        error = error || e
    }

    error ? process.exit(1) : process.exit(0)
}

startup()

process.on("SIGTERM", () => {
    shutdown()
})

process.on("SIGINT", () => {
    shutdown()
})

process.on("uncaughtException", error => {
    console.log(error)

    shutdown(error)
})