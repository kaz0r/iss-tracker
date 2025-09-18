import { Redis } from '@upstash/redis'
import IORedis from 'ioredis'

const REDIS_HOST = process.env.REDIS_HOST as string
const REDIS_PORT = process.env.REDIS_PORT as string
const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string

// Detect if we're in Cloudflare Workers environment
const isCloudflareWorkers = typeof globalThis.caches !== 'undefined'

export const getRedisClient = () => {
    if (!REDIS_HOST) throw new Error("Redis host not set.")
    if (!REDIS_PORT) throw new Error("Redis port not set")
    if (!REDIS_PASSWORD) throw new Error("Redis password not set")

    if (isCloudflareWorkers) {
        // For Cloudflare Workers, use Upstash client with HTTPS
        return new Redis({
            url: `https://${REDIS_HOST}:${REDIS_PORT}`,
            token: REDIS_PASSWORD
        })
    } else {
        // For Node.js development, use ioredis
        return new IORedis({
            host: REDIS_HOST,
            port: Number(REDIS_PORT),
            password: REDIS_PASSWORD
        })
    }
}