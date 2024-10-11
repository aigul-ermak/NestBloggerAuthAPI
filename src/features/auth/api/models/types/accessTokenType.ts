export type AccessTokenType = {
    loginOrEmail: string | undefined,
    id: string,
    deviceId: string
}

export type RefreshTokenType = {
    userId: string,
    deviceId: string,
    userIP: string,
    userAgent: string,
}