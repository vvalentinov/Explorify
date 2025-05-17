import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

const LocationPicker = ({ onLocationSelect }) => {
    const [position, setPosition] = useState(null);

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                onLocationSelect(e.latlng);
            }
        });
        return position ? (
            <Marker position={position} />
        ) : null;
    };

    return (
        <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '400px', width: '100%', borderRadius: '10px', marginTop: '1rem' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler />
        </MapContainer>
    );
};

export default LocationPicker;
