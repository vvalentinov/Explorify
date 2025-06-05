import PlacesWithSearchPage from "../PlacesWithSearchPage/PlacesWithSearchPage";

import { PlaceSearchContext } from '../../../constants/placeSearchContext';

const FavPlaces = () => <PlacesWithSearchPage isForAdmin={false} searchContext={PlaceSearchContext.FavPlace} />;

export default FavPlaces;