import { j, publicProcedure } from "../jstack";
import { getRedisClient } from "@/lib/redis-client";

interface IssData {
    message: string,
    iss_position: {
        latitude: number,
        longitude: number,
    }
    timestamp: Date
}

export const issRouter = j.router({
    getPosition: publicProcedure.query(async ({ c, ctx }) => {
        const data = await fetch("http://api.open-notify.org/iss-now.json")

        const body: IssData = await data.json()

        // Store current position in Redis
        const redis = getRedisClient()
        const timestamp = Date.now()

        // Store the latest position with 24h TTL
        await redis.setex("iss:latest", 86400, JSON.stringify({
            ...body.iss_position,
            timestamp
        }))

        // Store position in a list for path tracking (keep last 100 positions)
        await redis.lpush("iss:path", JSON.stringify({
            ...body.iss_position,
            timestamp
        }))

        // Keep only the last 100 positions and set TTL for 24 hours
        await redis.ltrim("iss:path", 0, 1500)
        await redis.expire("iss:path", 86400)

        return c.superjson(body)
    }),
    getPath: publicProcedure.query(async ({ c, ctx }) => {
        const redis = getRedisClient()

        // Get all positions from the path list
        const pathData = await redis.lrange("iss:path", 0, -1)

        // Parse and return the path data
        const path = pathData.map(item => JSON.parse(item)).map(pos => ({
            latitude: pos.latitude,
            longitude: pos.longitude,
            timestamp: pos.timestamp
        }))

        return c.superjson(path)
    })
})