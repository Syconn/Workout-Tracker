export function jwtSecret() {
    const key = process.env.JWT_SECRET;
    if (!key) throw new Error("JWT_SECRET Key is not defined")
    return key
}

export function port() {
    const key = process.env.PORT;
    if (!key) throw new Error("Port is not defined")
    return key
}