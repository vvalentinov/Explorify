import styles from './UnapprovedPlaces.module.css';

import {
    useState,
    useEffect,
    useContext,
    useRef,
    useLayoutEffect,
} from "react";

import {
    Card,
    Modal,
    Typography,
    Spin,
    Image,
    Button,
    App,
    Rate,
    Pagination,
    Avatar,
    Popover,
    Divider
} from 'antd';

import { PictureOutlined, UserOutlined } from "@ant-design/icons";

import { AuthContext } from "../../../contexts/AuthContext";
import { adminServiceFactory } from "../../../services/adminService";

import { fireError } from '../../../utils/fireError';

import { useNavigate } from 'react-router-dom';

const UnapprovedPlaces = () => {

    const { notification } = App.useApp();

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);

    // State Management
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [shouldScroll, setShouldScroll] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const unapprovedPlacesSectionRef = useRef(null);

    useLayoutEffect(() => {

        if (shouldScroll && unapprovedPlacesSectionRef.current) {
            unapprovedPlacesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setShouldScroll(false);
        }

    }, [shouldScroll]);



    useEffect(() => {

        const startTime = Date.now();

        adminService
            .getUnapprovedPlaces(currentPage)
            .then(res => {

                setPlaces(res.places);
                setPagesCount(res.pagesCount);

                const elapsed = Date.now() - startTime;
                const remainingTime = Math.max(1000 - elapsed, 0);

                setTimeout(() => setLoading(false), remainingTime);

            })
            .catch(err => {
                fireError(err);
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

                navigate('/admin', { state: { successOperation: { message: res.successMessage } } });

                // notification.success({
                //     message: 'Approved Place',
                //     description: res.successMessage,
                //     placement: 'topRight',
                //     duration: 5,
                // });

            }).catch(err => console.log(err));
    };

    return (
        <>
            <section className={styles.unapprovedPlacesSection} ref={unapprovedPlacesSectionRef}>

                <div className={styles.unapprovedPlacesContainer}>
                    {
                        loading ?
                            (
                                <div style={{ textAlign: 'center' }}>
                                    <Spin spinning={loading} size="large" />
                                </div>
                            ) :
                            places.map(place =>

                                <Card
                                    hoverable
                                    key={place.id}
                                    className={styles.unapprovedPlaceCard}
                                    cover={<img alt={place.name} src={place.thumbUrl} style={{ objectFit: 'cover', height: '230px' }} />}
                                    style={{ overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                                    styles={{
                                        body: {
                                            // padding: '1rem',
                                            textAlign: 'center',
                                            backgroundColor: '#3e75fc',
                                        }
                                    }}
                                    onClick={() => handleCardClick(place)}
                                >
                                    <Card.Meta title={<span style={{ color: '#fff' }}>{place.name}</span>} />
                                </Card>
                            )
                    }
                </div>


                {pagesCount > 1 && !loading && <Pagination
                    pageSize={6}
                    align='center'
                    current={currentPage}
                    total={pagesCount * 6}
                    onChange={handlePageChange}
                    style={{ textAlign: 'center', marginBottom: '2rem' }}
                />}

            </section>

            {/* Modal to show place details */}
            {selectedPlace && (

                <Modal
                    open={true}
                    onCancel={handleCloseModal}
                    footer={null}
                    title={

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                            <Popover placement='left' content={selectedPlace.userName}>
                                <Avatar
                                    src={selectedPlace.userProfilePicUrl || undefined}
                                    size={40}
                                    icon={selectedPlace.userProfilePicUrl && <UserOutlined />}
                                />
                            </Popover>

                            <Typography.Text>{selectedPlace.name}</Typography.Text>

                        </div>
                    }
                    width={800}
                    style={{ top: 20 }}
                >

                    <Divider />

                    {selectedPlace?.imagesUrls?.length > 0 && (

                        <Card
                            title={
                                <span style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
                                    <PictureOutlined style={{ marginRight: 8 }} />
                                    Images
                                </span>
                            }
                            size="default"
                            style={{
                                marginTop: '2rem',
                                backgroundColor: '#ffffff',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                            }}
                            styles={{
                                header: {
                                    backgroundColor: '#4C6EF5',
                                    color: '#fff',
                                    borderTopLeftRadius: '12px',
                                    borderTopRightRadius: '12px',
                                    padding: '12px 16px',
                                }
                            }}
                        >
                            <Image.PreviewGroup>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        flexWrap: 'wrap',
                                        justifyContent: 'flex-start',
                                        padding: '8px 4px',
                                    }}
                                >
                                    {selectedPlace.imagesUrls.map((url, index) => (
                                        <Image
                                            key={index}
                                            src={url}
                                            width={110}
                                            height={110}
                                            style={{
                                                objectFit: 'cover',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                transition: 'transform 0.25s ease-in-out',
                                            }}
                                            preview
                                        />
                                    ))}
                                </div>
                            </Image.PreviewGroup>
                        </Card>

                    )}

                    <Card
                        style={{
                            marginTop: '2rem',
                            borderRadius: '14px',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                            border: 'none',
                            backgroundColor: '#fdfdfd',
                        }}
                        styles={{
                            header: {
                                backgroundColor: '#4C6EF5',
                                color: '#fff',
                                fontSize: '16px',
                                borderTopLeftRadius: '14px',
                                borderTopRightRadius: '14px',
                                padding: '14px 18px',
                            }
                        }}
                        size="default"
                        title="📄 Description"
                    >
                        <Typography.Paragraph
                            style={{
                                textAlign: 'justify',
                                fontSize: '14px',
                                lineHeight: 1.8,
                                color: '#333',
                                marginBottom: 0,
                            }}
                        >
                            {selectedPlace?.description}
                        </Typography.Paragraph>
                    </Card>


                    <Card
                        style={{
                            marginTop: '2rem',
                            borderRadius: '14px',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                            border: 'none',
                            backgroundColor: '#fdfdfd',
                        }}

                        styles={{
                            header: {
                                backgroundColor: '#4C6EF5',
                                color: '#fff',
                                fontSize: '16px',
                                borderTopLeftRadius: '14px',
                                borderTopRightRadius: '14px',
                                padding: '14px 18px',
                            }
                        }}
                        size="default"
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{selectedPlace.userName}'s Review</span>
                                <Rate disabled value={selectedPlace.reviewStars} />
                            </div>
                        }
                    >
                        <Typography.Paragraph
                            style={{
                                textAlign: 'justify',
                                fontSize: '14px',
                                lineHeight: 1.7,
                                color: '#444',
                                marginBottom: 0
                            }}
                        >
                            {selectedPlace?.reviewContent}
                        </Typography.Paragraph>
                    </Card>

                    <Button
                        block
                        size="large"
                        style={{ marginTop: '1rem' }}
                        color="cyan" variant="solid"
                        onClick={handleApprove}
                    >
                        Approve
                    </Button>

                    <Button
                        block
                        size="large"
                        style={{ marginTop: '1rem' }}
                        color="danger" variant="solid"
                    // onClick={handleApprove}
                    >
                        Delete
                    </Button>

                </Modal>
            )}
        </>
    );
};

export default UnapprovedPlaces;