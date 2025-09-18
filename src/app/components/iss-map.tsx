"use client"

import { client } from "@/lib/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("./map").then((mod) => ({ default: mod.Map })), {
    ssr: false,
    loading: () => <div>Loading map...</div>
})

export const IssMap = () => {
    const queryClient = useQueryClient()

    const { data: issObject, isPending: isLoadingPosition } = useQuery({
        queryKey: ["get-iss-position"],
        queryFn: async () => {
            const res = await client.issData.getPosition.$get()

            const json = await res.json()

            return json
        },
        refetchInterval: () => {
            return 5000
        }
    })

    const { data: pathData, isPending: isLoadingPath } = useQuery({
        queryKey: ["get-iss-path"],
        queryFn: async () => {
            const res = await client.issData.getPath.$get()

            const json = await res.json()

            return json
        },
        refetchInterval: () => {
            return 10000
        }
    })

    if (isLoadingPosition)
        return (<div>loading</div>)

    if (!issObject)
        return (<div>error</div>)

    const issPosition = issObject.iss_position

    return (<>
        <Map
            latitude={issPosition.latitude}
            longitude={issPosition.longitude}
            pathData={pathData || []}
        />
    </>)
}