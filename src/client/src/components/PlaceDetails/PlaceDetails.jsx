import { useLocation } from "react-router-dom";

import { useState, useEffect } from "react";

import { placesServiceFactory } from "../../services/placesService";

import { fireError } from "../../utils/fireError";

import { Carousel, Card } from 'antd';

const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

const carouselWrapperStyle = {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto 1.5rem auto',
};

const imageStyle = {
    width: '100%',
    height: '350px',
    objectFit: 'cover',
    borderRadius: '10px',
};

const PlaceDetails = () => {

    const placeService = placesServiceFactory();

    const location = useLocation();

    const [place, setPlace] = useState({});

    useEffect(() => {

        if (location.state?.placeId) {
            placeService
                .getPlaceDetailsById(location.state?.placeId)
                .then(res => setPlace(res))
                .catch(err => fireError(err));
        }

    }, []);

    return (
        <>
            {place && (
                <Card
                    title={place.name}
                    style={{
                        maxWidth: '700px',
                        margin: '2rem auto',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                    }}
                >
                    {place.imagesUrls?.length > 0 && (
                        <div style={carouselWrapperStyle}>
                            <Carousel
                                arrows
                                dots
                                autoplay
                                infinite
                                style={{ borderRadius: '10px' }}
                            >
                                {place.imagesUrls.map((x, i) => (
                                    <div key={i}>
                                        <img src={x} alt={`Slide ${i}`} style={imageStyle} />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    )}

                    <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
                        {place.description}
                    </p>
                </Card>
            )}
        </>
    )
};

export default PlaceDetails;