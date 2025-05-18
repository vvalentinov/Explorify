import { MapContainer, TileLayer } from 'react-leaflet';
import LocationMarkerLogic from './LocationMarkerLogic';

const LocationPicker = ({ location, onLocationSelect }) => {
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
            <LocationMarkerLogic location={location} onLocationSelect={onLocationSelect} />
        </MapContainer>
    );
};

export default LocationPicker;
