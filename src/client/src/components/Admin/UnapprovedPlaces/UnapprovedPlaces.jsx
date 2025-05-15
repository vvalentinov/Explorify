import styles from './UnapprovedPlaces.module.css';

import { useState, useEffect, useContext, useRef, useLayoutEffect } from "react";
import { Card, Modal, Typography, Spin, Image, Button, App, Rate, Pagination } from 'antd';
import { AuthContext } from "../../../contexts/AuthContext";

import { PictureOutlined } from "@ant-design/icons";

import { adminServiceFactory } from "../../../services/adminService";

const UnapprovedPlaces = () => {

    const { notification } = App.useApp();

    const { token } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);

    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    const unapprovedPlacesSectionRef = useRef(null);

    useLayoutEffect(() => {
        if (shouldScroll && unapprovedPlacesSectionRef.current) {
            unapprovedPlacesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setShouldScroll(false);
        }
    }, [shouldScroll]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(0);

    useEffect(() => {

        const startTime = Date.now();


        adminService
            .getUnapprovedPlaces(currentPage)
            .then(res => {
                setPlaces(res.places);
                setPagesCount(res.pagesCount);

                const elapsed = Date.now() - startTime;
                const remainingTime = Math.max(1000 - elapsed, 0);

                setTimeout(() => {
                    setLoading(false);
                }, remainingTime);

            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const handlePageChange = (page) => {
        setLoading(true);
        setCurrentPage(page);

        const MIN_SPINNER_TIME = 1000;
        const startTime = Date.now();

        adminService
            .getUnapprovedPlaces(page)
            .then(res => {
                const elapsed = Date.now() - startTime;
                const remaining = MIN_SPINNER_TIME - elapsed;

                setTimeout(() => {
                    setPlaces(res.places);
                    setPagesCount(res.pagesCount);
                    setLoading(false);
                    setShouldScroll(true);
                }, remaining > 0 ? remaining : 0);
            })
            .catch(err => {
                setLoading(false);
                fireError(err);
            });
    };

    const handleCardClick = (place) => setSelectedPlace(place);

    const handleCloseModal = () => setSelectedPlace(null);

    const handleApprove = () => {

        adminService
            .approvePlace(selectedPlace.id)
            .then(res => {

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
            <section
                ref={unapprovedPlacesSectionRef}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    // border: 'solid 1px black'
                }}>
                {loading ? (
                    <div style={{ textAlign: 'center' }}>
                        <Spin spinning={loading} size="large" />
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '1rem',
                            padding: '2rem 0',
                            // border: 'solid 1px black',
                            width: '100%'
                        }}
                    >
                        {places.map(place => (

                            <Card
                                key={place.id}
                                className={styles.unapprovedPlaceCard}
                                hoverable
                                cover={
                                    <img
                                        alt={place.name}
                                        src={place.imagesUrls[0]}
                                        style={{
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '8px',
                                            borderTopRightRadius: '8px',
                                        }}
                                    />
                                }
                                style={{
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s ease',
                                    flexBasis: '30%',
                                    flexWrap: 'wrap'
                                }}
                                styles={{
                                    body: {
                                        backgroundColor: '#3e75fc',
                                        textAlign: 'center',
                                        padding: '1rem',

                                    }
                                }}
                                onClick={() => handleCardClick(place)}
                            >
                                <Card.Meta
                                    title={<span style={{ color: '#fff' }}>{place.name}</span>}
                                />
                            </Card>
                        ))}
                    </div>
                )}

            </section>

            {pagesCount > 1 && <Pagination
                align='center'
                onChange={handlePageChange}
                current={currentPage}
                total={pagesCount * 6}
                pageSize={6}
                style={{ textAlign: 'center', marginBottom: '2rem' }}
            />}



            {/* Modal to show place details */}
            {selectedPlace && (

                <Modal
                    open={true}
                    onCancel={handleCloseModal}
                    footer={null}
                    title={
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>{selectedPlace.name}</span>
                            <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>uploaded by {selectedPlace.userName}</span>
                        </div>
                    }
                    width={800}
                    style={{ top: 20 }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem',
                        }}
                    >

                    </div>

                    {selectedPlace?.imagesUrls?.length > 0 && (
                        <Card
                            title={
                                <span
                                    style={{ color: 'white' }}>
                                    <PictureOutlined style={{ marginRight: 8 }} />
                                    Images
                                </span>
                            }
                            size="small"
                            style={{
                                marginTop: '1.5rem',
                                backgroundColor: '#9faaff',
                                border: '1px solid #b7eb8f',
                                borderRadius: '10px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            }}
                            styles={{
                                header: {
                                    backgroundColor: '#5273f9',
                                    fontWeight: 'bold'
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
                        </Card>
                    )}

                    <Card
                        style={{ marginTop: '1rem' }}
                        size="small"
                        title='Description'
                        styles={{
                            header: {
                                backgroundColor: '#5f71f6',
                                color: '#fff'
                            },
                            body: {
                                backgroundColor: '#9faaff'
                            }
                        }}
                    >
                        <Typography.Paragraph style={{ textAlign: 'justify', }}>
                            {selectedPlace?.description}
                        </Typography.Paragraph>

                    </Card>

                    <Card
                        style={{ marginTop: '1rem' }}
                        size="small"
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{selectedPlace.userName}'s review</span>
                                <Rate disabled value={selectedPlace.reviewStars} />
                            </div>
                        }
                        styles={{
                            header: {
                                backgroundColor: '#5f71f6',
                                color: '#fff'
                            },
                            body: {
                                backgroundColor: '#9faaff'
                            }
                        }}
                    >
                        <Typography.Paragraph style={{ textAlign: 'justify' }}>
                            {selectedPlace?.reviewContent}
                        </Typography.Paragraph>

                    </Card>

                    <Button
                        className={styles.approveButton}
                        style={{
                            marginTop: '1rem',
                            backgroundColor: '#5f71f6'
                        }}
                        size="large"
                        block
                        onClick={handleApprove}>
                        Approve
                    </Button>

                </Modal>
            )}
        </>
    );
};

export default UnapprovedPlaces;