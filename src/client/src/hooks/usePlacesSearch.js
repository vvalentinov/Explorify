import { useState, useEffect } from "react";
import { fireError } from "../utils/fireError";

export const usePlacesSearch = (placesService, state, debouncedPlaceName, skipNextSearchRef) => {

    const [places, setPlaces] = useState([]);
    const [pagesCount, setPagesCount] = useState(0);
    const [spinnerLoading, setSpinnerLoading] = useState(false);

    useEffect(() => {
        if (skipNextSearchRef.current) {
            skipNextSearchRef.current = false;
            return;
        }

        const fetchPlaces = async () => {
            setSpinnerLoading(true);
            try {
                const params = new URLSearchParams({
                    context: state.searchContext,
                    name: debouncedPlaceName,
                    page: state.currentPage,
                    status: state.filter,
                });

                if (state.selectedCategoryPath?.length === 2) {
                    params.append('categoryId', state.selectedCategoryPath[0]);
                    params.append('subcategoryId', state.selectedCategoryPath[1]);
                } else if (state.selectedCategoryPath?.length === 1) {
                    params.append('categoryId', state.selectedCategoryPath[0]);
                }

                if (state.selectedCountryId) {
                    params.append('countryId', state.selectedCountryId);
                }

                if (state.selectedTagIds.length > 0) {
                    state.selectedTagIds.forEach(tagId => params.append('tags', tagId));
                }

                const response = await placesService.searchPlace(params);
                setPlaces(response.places);
                setPagesCount(response.pagination.pagesCount);

            } catch (error) {
                fireError(error);
            } finally {
                setSpinnerLoading(false);
            }
        };

        fetchPlaces();
    }, [
        placesService,
        state.searchContext,
        state.currentPage,
        state.filter,
        state.selectedCategoryPath,
        state.selectedCountryId,
        state.selectedTagIds,
        debouncedPlaceName,
        skipNextSearchRef
    ]);

    return { places, pagesCount, spinnerLoading };
};
