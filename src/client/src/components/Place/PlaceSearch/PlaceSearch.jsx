import PlacesWithSearchPage from "../PlacesWithSearchPage/PlacesWithSearchPage";

import { PlaceSearchContext } from "../../../constants/placeSearchContext";

const PlaceSearch = () => <PlacesWithSearchPage isForAdmin={false} searchContext={PlaceSearchContext.Global} />;

export default PlaceSearch;
