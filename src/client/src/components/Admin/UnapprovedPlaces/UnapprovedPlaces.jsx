import { useState, useEffect, useContext } from "react";
import { Card, Modal, Typography, Spin, Image, Button, App } from 'antd';
import { AuthContext } from "../../../contexts/AuthContext";

import { adminServiceFactory } from "../../../services/adminService";

const { Title, Paragraph } = Typography;

const UnapprovedPlaces = () => {

    const { notification } = App.useApp();

    const { token } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);

    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlace, setSelectedPlace] = useState(null);


    useEffect(() => {
        adminService
            .getUnapprovedPlaces()
            .then(res => {
                setPlaces(res.places);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const handleCardClick = (place) => {
        setSelectedPlace(place); // Open the modal with place details
    };

    const handleCloseModal = () => {
        setSelectedPlace(null); // Close the modal
    };

    const handleApprove = () => {

        adminService
            .approvePlace(selectedPlace.id)
            .then(res => {
                console.log(res);

                setPlaces(places.filter(x => x.id !== selectedPlace.id));
                handleCloseModal();

                notification.success({
                    message: 'Approved Place',
                    description: res.successMessage,
                    placement: 'topRight',
                    duration: 5,
                });
            }).catch(err => console.log(err));
    };

    return (
        <>
            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    {places.map(place => (
                        <Card
                            key={place.id}
                            hoverable
                            style={{ width: 240, borderRadius: '8px' }}
                            cover={<img alt={place.name} src={place.imagesUrls[0]} />}
                            onClick={() => handleCardClick(place)}
                        >
                            <Title level={4}>{place.name}</Title>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal to show place details */}
            {selectedPlace && (
                <Modal
                    open={true}
                    onCancel={handleCloseModal}
                    footer={null}
                    title={`${selectedPlace.name} - uploaded by ${selectedPlace.userName}`}
                    width={800}
                    styles={{
                        header: {
                            // backgroundColor: '#001529'
                        }
                    }}
                >

                    <Image.PreviewGroup>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start'
                        }}
                        >
                            {selectedPlace.imagesUrls.map((url, index) => (
                                <Image
                                    key={index}
                                    src={url}
                                    width={100}
                                    height={100}
                                    style={{
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                                        transition: 'transform 0.2s ease-in-out',
                                    }}
                                    preview
                                />
                            ))}
                        </div>
                    </Image.PreviewGroup>
                    <div>
                        <Title level={3}>Description</Title>
                        <Paragraph>{selectedPlace.description}</Paragraph>

                        <Title level={4}>Category: {selectedPlace.categoryName}</Title>
                        <Title level={4}>Country: {selectedPlace.countryName}</Title>

                        <Title level={4}>Review</Title>
                        <Paragraph>{selectedPlace.reviewContent}</Paragraph>
                        <Paragraph><strong>Rating: </strong>{selectedPlace.reviewStars} stars</Paragraph>
                    </div>

                    <Button onClick={handleApprove}>Approve</Button>

                </Modal>
            )}
        </>
    );
};

export default UnapprovedPlaces;
