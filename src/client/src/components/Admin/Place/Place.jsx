import { Spin, ConfigProvider } from 'antd';

import { useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

import { adminServiceFactory } from '../../../services/adminService';

import { AuthContext } from '../../../contexts/AuthContext';

import PlaceStatusPill from './PlaceStatusPill';
import DeletedPlaceCard from './Cards/DeletedPlaceCard';
import ApprovedPlaceCard from './Cards/ApprovedPlaceCard';
import UnapprovedPlaceCard from './Cards/UnapprovedPlaceCard';
import PlaceDetailsSection from '../../PlaceDetails/PlaceDetailsSection/PlaceDetailsSection';

import { fireError } from '../../../utils/fireError';
import { getGoogleMapsUrl } from '../../../utils/getGoogleMapsUrl';

const Place = () => {

    const { token } = useContext(AuthContext);

    const location = useLocation();

    const adminService = adminServiceFactory(token);

    // State Management
    const [place, setPlace] = useState();
    const [mapUrl, setMapUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if (location.state?.placeId) {

            adminService
                .getPlaceInfo(location.state?.placeId)
                .then(res => {

                    setPlace(res);
                    setIsLoading(false);
                    setMapUrl(getGoogleMapsUrl(res.coordinates.latitude, res.coordinates.longitude));

                }).catch(err => {
                    fireError(err);
                });
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