import { Marker, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';

const LocationMarkerLogic = ({ location, onLocationSelect }) => {
    const map = useMap();
    const markerRef = useRef(null);

    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        }
    });

    useEffect(() => {
        if (location && map) {
            map.flyTo([location.lat, location.lng], 15);
            if (markerRef.current) {
                markerRef.current.setLatLng([location.lat, location.lng]);
            }
        }
    }, [location]);

    return location ? (
        <Marker
            ref={markerRef}
            position={[location.lat, location.lng]}
            icon={L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            })}
        />
    ) : null;
};

export default LocationMarkerLogic;
