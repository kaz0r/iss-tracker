"use client"
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
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
    longitude: number
}

export const Map = ({ latitude, longitude }: MapMarkerPositionProps) => {
    const issIcon = L.icon({
        iconUrl: "/iss.svg",
        iconSize: [32, 32],
        iconAnchor: [32, 32],
        popupAnchor: [0, -32],
    })

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
                <Marker position={[latitude, longitude]} icon={issIcon}>
                    <Popup>
                        <p>Iss current position <br /> {`Latitude: ${latitude}`} <br /> {`Longitude: ${longitude}`}</p>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}