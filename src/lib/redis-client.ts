import Redis from 'ioredis'

const REDIS_HOST = process.env.REDIS_HOST as string
const REDIS_PORT = process.env.REDIS_PORT as string
const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string

export const getRedisClient = () => {
    if (!REDIS_HOST)
        throw new Error("Redis host not set.")

    if (!REDIS_PORT)
        throw new Error("Redis port not set")

    if (!REDIS_PASSWORD)
        throw new Error("Redis password not set")

    const redis = new Redis({
        host: REDIS_HOST,
        port: Number(REDIS_PORT),
        password: REDIS_PASSWORD
    })

    return redis
}