import { useState, useEffect } from "react";

import { placesServiceFactory } from "../../services/placesService";

import { useLocation } from "react-router-dom";

import { fireError } from "../../utils/fireError";

import PlacesList from '../PlacesList/PlacesList';

const PlacesInSubcategory = () => {

    const location = useLocation();

    const placeService = placesServiceFactory();

    const [places, setPlaces] = useState([]);

    useEffect(() => {

        if (location.state?.subcategoryId) {
            placeService
                .getPlacesInSubcategory(location.state.subcategoryId)
                .then(res => setPlaces(res))
                .catch(err => fireError(err));
        }

    }, []);

    return (
        <>
            {places.length > 0 && <PlacesList places={places} />}
        </>
    );
};

export default PlacesInSubcategory;