declare namespace Express {
    export interface Request {
        user: {
            userId: string;
            deviceId: string;
            userIP: string;
            userAgent: string
        }
    }
}