import PlacesWithSearchPage from "./PlacesWithSearchPage/PlacesWithSearchPage";

const MyPlaces = () => {

    return <PlacesWithSearchPage
        isForAdmin={false}
        searchContext="UserPlaces"
    />
};

export default MyPlaces;