export type AccessTokenType = {
    loginOrEmail: string | undefined,
    id: string
}

export type RefreshTokenType = {
    userId: string,
    deviceId: string,
    userIP: string,
    userAgent: string,
}