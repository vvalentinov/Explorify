import PlacesWithSearchPage from "./PlacesWithSearchPage/PlacesWithSearchPage";

import { PlaceSearchContext } from '../../constants/placeSearchContext';

const AdminPlaces = () => <PlacesWithSearchPage isForAdmin={true} searchContext={PlaceSearchContext.Admin} />;

export default AdminPlaces;