import { j, publicProcedure } from "../jstack";

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

        return c.superjson(body)
    })
})