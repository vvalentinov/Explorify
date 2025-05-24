export const getGoogleMapsUrl = (latitude, longitude) => {

    const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    const url = `https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${latitude},${longitude}`;

    return url;

}