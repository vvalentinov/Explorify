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

                    const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
                    setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${res.coordinates.latitude},${res.coordinates.longitude}`);

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

                            {/* {place.isApproved && <ApprovedPlaceCard />}

                            {!place?.isApproved && <UnapprovedPlaceCard />} */}

                            {place?.isDeleted ? (
                                <DeletedPlaceCard />
                            ) : place?.isApproved ? (
                                <ApprovedPlaceCard />
                            ) : (
                                <UnapprovedPlaceCard />
                            )}

                        </>
                    )
            }
        </>
    )
};

export default Place;