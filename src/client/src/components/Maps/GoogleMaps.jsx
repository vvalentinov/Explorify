import { useEffect, useRef } from 'react';

const GoogleMapWithMarker = ({ lat, lng, isForAdmin }) => {

    const mapRef = useRef(null);

    useEffect(() => {
        const initializeMap = async () => {
            try {
                const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
                    google.maps.importLibrary('maps'),
                    google.maps.importLibrary('marker'),
                ]);

                const position = { lat: Number(lat), lng: Number(lng) };

                const map = new Map(mapRef.current, {
                    center: position,
                    zoom: 15,
                    mapId: 'DEMO_MAP_ID',
                    mapTypeId: 'roadmap',
                    mapTypeControl: false,
                });

                new AdvancedMarkerElement({ map, position, title: 'Location' });

            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        if (window.google?.maps?.importLibrary) {
            initializeMap();
        }

    }, [lat, lng]);

    return <div ref={mapRef} style={{ width: isForAdmin ? '100%' : '60%', height: '500px', borderRadius: '12px', border: 'solid 1px lightgrey' }} />;
};

export default GoogleMapWithMarker;

