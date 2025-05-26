import { Spin, ConfigProvider } from 'antd';

import { useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

import { placesServiceFactory } from '../../../services/placesService';

import { AuthContext } from '../../../contexts/AuthContext';

import PlaceStatusPill from './PlaceStatusPill';
import DeletedPlaceCard from './Cards/DeletedPlaceCard';
import ApprovedPlaceCard from './Cards/ApprovedPlaceCard';
import UnapprovedPlaceCard from './Cards/UnapprovedPlaceCard';
import PlaceDetailsSection from '../../Place/PlaceDetails/PlaceDetailsSection/PlaceDetailsSection';

import { fireError } from '../../../utils/fireError';
import { getGoogleMapsUrl } from '../../../utils/getGoogleMapsUrl';

const Place = () => {

    const { token } = useContext(AuthContext);

    const location = useLocation();

    const placeService = placesServiceFactory(token);

    // State Management
    const [place, setPlace] = useState();
    const [mapUrl, setMapUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if (location.state?.placeId) {

            placeService
                .getPlaceDetailsById(location.state?.placeId, true)
                .then(res => {
                    setPlace(res);
                    setIsLoading(false);
                    setMapUrl(getGoogleMapsUrl(res.latitude, res.longitude));
                }).catch(err => {
                    fireError(err);
                })
        }

    }, []);

    return (
        <>
            {
                isLoading ?
                    <ConfigProvider theme={{
                        components: {
                            Spin: {
                                colorPrimary: 'white'
                            }
                        }
                    }}>
                        <Spin spinning={isLoading} />
                    </ConfigProvider> :
                    (
                        <>
                            <PlaceStatusPill place={place} />

                            {place && <PlaceDetailsSection
                                isForAdmin={true}
                                place={place}
                                mapUrl={mapUrl}
                                loading={false}
                            />}

                            {
                                place?.isDeleted ?
                                    (
                                        <DeletedPlaceCard />
                                    ) :
                                    place?.isApproved ?
                                        (
                                            <ApprovedPlaceCard place={place} />
                                        ) :
                                        (
                                            <UnapprovedPlaceCard place={place} />
                                        )
                            }

                        </>
                    )
            }
        </>
    )
};

export default Place;