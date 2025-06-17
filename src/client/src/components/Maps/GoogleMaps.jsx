import { useEffect, useRef } from 'react';

import styles from './GoogleMaps.module.css';

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

    return <div ref={mapRef} className={styles.googleMaps} style={{ width: isForAdmin ? '100%' : '60%' }} />;
};

export default GoogleMapWithMarker;

