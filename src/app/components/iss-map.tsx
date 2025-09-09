"use client"

import { client } from "@/lib/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Map } from "./map"

export const IssMap = () => {
    const queryClient = useQueryClient()

    const { data: issObject, isPending: isLoadingPosition } = useQuery({
        queryKey: ["get-iss-position"],
        queryFn: async () => {
            const res = await client.issData.getPosition.$get()

            return await res.json()
        },
        refetchInterval: () => {
            return 5000
        }
    })

    if (isLoadingPosition)
        return (<div>loading</div>)

    if (!issObject)
        return (<div>error</div>)

    const issPosition = issObject.iss_position

    return (<>
        <Map latitude={issPosition.latitude} longitude={issPosition.longitude} />
    </>)
}