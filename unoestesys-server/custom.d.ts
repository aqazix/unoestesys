declare namespace Express {
    export interface Request {
        appointment_id: number,
        userId?: number
    }
}