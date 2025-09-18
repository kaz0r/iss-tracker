"use client"
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers - only run on client side
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
}

interface MapMarkerPositionProps {
    latitude: number,
    longitude: number,
    pathData: Array<{
        latitude: number,
        longitude: number,
        timestamp: number
    }>
}

export const Map = ({ latitude, longitude, pathData }: MapMarkerPositionProps) => {
    const issIcon = L.icon({
        iconUrl: "/iss.svg",
        iconSize: [32, 32],
        iconAnchor: [32, 32],
        popupAnchor: [0, -32],
    })

    // Split path into segments to handle longitude wrap-around
    const splitPathIntoSegments = (path: Array<{ latitude: number, longitude: number, timestamp: number }>) => {
        if (path.length < 2) return []

        const segments: Array<Array<{ latitude: number, longitude: number, timestamp: number }>> = []
        let currentSegment = [path[0]!]

        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1]!
            const current = path[i]!

            // Check for longitude jump > 180 degrees (crossing date line)
            const lonDiff = Math.abs(current.longitude - prev.longitude)

            if (lonDiff > 180) {
                // End current segment and start new one
                if (currentSegment.length > 1) {
                    segments.push(currentSegment)
                }
                currentSegment = [current]
            } else {
                currentSegment.push(current)
            }
        }

        // Add the last segment if it has more than one point
        if (currentSegment.length > 1) {
            segments.push(currentSegment)
        }

        return segments
    }

    const pathSegments = splitPathIntoSegments(pathData)

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <MapContainer
                center={[20, 0]}
                zoom={3}
                minZoom={3}
                maxZoom={18}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
                style={{ height: '100%', width: '100%' }}
                worldCopyJump={true}
                maxBounds={[[-85, -180], [85, 180]]}
                maxBoundsViscosity={1.0}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    noWrap={false}
                    minZoom={2}
                    maxZoom={18}
                />
                {/* ISS Path as orange line segments */}
                {pathSegments.map((segment, index) => (
                    <Polyline
                        key={index}
                        positions={segment.map(pos => [pos.latitude, pos.longitude])}
                        pathOptions={{
                            color: '#ff6600',
                            weight: 3,
                            opacity: 0.8
                        }}
                    />
                ))}

                <Marker position={[latitude, longitude]} icon={issIcon}>
                    <Popup>
                        <p>ISS current position <br /> {`Latitude: ${latitude}`} <br /> {`Longitude: ${longitude}`}</p>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}