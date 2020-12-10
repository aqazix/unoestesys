declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SECRET: string
            SMTPEMAIL: string
            SMTPPASSWORD: string
        }
    }
}

export {}