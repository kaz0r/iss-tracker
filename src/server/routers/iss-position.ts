import { j, publicProcedure } from "../jstack";
import { getRedisClient } from "../utils/redis-clien";

interface IssData {
    latitude: string,
    longitude: string,
    timestamp: number
}

export const issRouter = j.router({
    getPosition: publicProcedure.query(async ({ c }) => {
        const redis = getRedisClient()

        const latestJson = await redis.get("iss:latest")
        const latest: IssData = latestJson ? JSON.parse(latestJson) : null

        return c.superjson(latest)
    }),
    getPath: publicProcedure.query(async ({ c }) => {
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