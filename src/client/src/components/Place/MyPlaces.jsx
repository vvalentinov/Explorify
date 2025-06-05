import PlacesWithSearchPage from "./PlacesWithSearchPage/PlacesWithSearchPage";

import { PlaceSearchContext } from "../../constants/placeSearchContext";

const MyPlaces = () => <PlacesWithSearchPage isForAdmin={false} searchContext={PlaceSearchContext.UserPlaces} />;

export default MyPlaces;