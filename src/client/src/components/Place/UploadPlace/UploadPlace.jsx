import styles from './UploadPlace.module.css';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

import LocationPicker from '../../LocationPicker/LocationPicker';

import { fireError } from '../../../utils/fireError';

import {
    Button,
    Cascader,
    Form,
    Input,
    Select,
    Card,
    ConfigProvider,
    Rate,
    Spin,
    Checkbox,
    Empty,
    Typography
} from 'antd';

import { UploadOutlined, CommentOutlined } from '@ant-design/icons';

import { useDebounce } from 'use-debounce';

import { homePath } from '../../../constants/paths';
import { AuthContext } from '../../../contexts/AuthContext';
import { vibesServiceFactory } from '../../../services/vibesService';
import { placesServiceFactory } from '../../../services/placesService';
import { countriesServiceFactory } from '../../../services/countriesService';
import { categoriesServiceFactory } from '../../../services/categoriesService';

import { motion } from 'framer-motion';

import ImageUpload from './ImageUpload/ImageUpload';

import {
    mapCountryOptions,
    mapCategoriesOptions,
    generateFormData,
} from './uploadPlaceUtil';

const UploadPlace = () => {

    const [form] = Form.useForm();

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    // Services
    const vibesService = vibesServiceFactory(token);
    const placesService = placesServiceFactory(token);
    const countriesService = countriesServiceFactory();
    const categoriesService = categoriesServiceFactory();

    // State Management
    const [tags, setTags] = useState([]);
    const [countryName, setCountryName] = useState('');
    const [countryOptions, setCountryOptions] = useState([]);
    const [selectLoading, setSelectLoading] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [isPlaceUploading, setIsPlaceUploading] = useState(false);
    const [isMapUpdate, setIsMapUpdate] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [location, setLocation] = useState(null);

    const [debounced] = useDebounce(countryName, 1000);

    useEffect(() => {
        if (location && isMapUpdate) {

            form.setFieldsValue({
                Latitude: location.lat.toFixed(5),
                Longitude: location.lng.toFixed(5),
            });

            setIsMapUpdate(false);
        }
    }, [location]);

    const handleLocationSelect = (latlng) => {
        setIsMapUpdate(true);
        setLocation(latlng);
    };

    useEffect(() => {

        if (!location) {
            navigator.geolocation.getCurrentPosition(
                (position) => {

                    const { latitude, longitude } = position.coords;
                    const currentLocation = { lat: latitude, lng: longitude };

                    setLocation(currentLocation);
                },
                (error) => { console.warn('Geolocation error:', error); },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        }

        vibesService
            .getVibes()
            .then(res => setTags(res))
            .catch(err => fireError(err));

        categoriesService
            .getCategoriesOptions()
            .then(res => {
                const options = mapCategoriesOptions(res);
                setCategoryOptions(options);
            }).catch(err => fireError(err));

    }, []);

    useEffect(() => {
        if (debounced) {
            countriesService
                .getCountries(debounced)
                .then(res => {
                    setCountryOptions(mapCountryOptions(res));
                })
                .catch(err => fireError('Failed to fetch countries'))
                .finally(() => setSelectLoading(false));
        }
    }, [debounced]);

    const onSubmit = (data) => {

        setIsPlaceUploading(true);

        const formData = generateFormData(data);

        placesService
            .uploadPlace(formData)
            .then(res => {
                setIsPlaceUploading(false);
                navigate(homePath, { state: { successOperation: { message: res.successMessage } } });
            }).catch(err => {
                setIsPlaceUploading(false);
                fireError(err);
            });
    }

    return (
        <section className={styles.uploadPlaceSection}>

            <div className={styles.uploadFormWrapper}>

                <h1 className={styles.pageTitle}><UploadOutlined /> Upload Place</h1>

                <Form form={form} onFinish={onSubmit} layout="vertical" size="large">

                    <Form.Item
                        name="Name"
                        label={<span style={{ fontSize: '1.3rem' }}>Name</span>}
                        rules={[{ required: true, max: 100 }]}
                    >
                        <Input style={{ fontSize: '1.5rem' }} size='large' placeholder="Enter place name..." />
                    </Form.Item>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '2rem',
                            marginTop: '1.5rem'
                        }}
                    >

                        <Form.Item style={{ width: '50%' }} name="Latitude" label={<span style={{ fontSize: '1.3rem' }}>Latitude</span>}>
                            <Input style={{ fontSize: '1.5rem' }}
                                onChange={(e) => {
                                    const newLat = parseFloat(e.target.value);
                                    if (!isNaN(newLat)) {
                                        setLocation(prev => prev ? { ...prev, lat: newLat } : { lat: newLat, lng: 0 });
                                    }
                                }}
                            />
                        </Form.Item>

                        <Form.Item style={{ width: '50%' }} name="Longitude" label={<span style={{ fontSize: '1.3rem' }}>Longitude</span>}>
                            <Input
                                style={{ fontSize: '1.5rem' }}
                                onChange={(e) => {
                                    const newLng = parseFloat(e.target.value);
                                    if (!isNaN(newLng)) {
                                        setLocation(prev => prev ? { ...prev, lng: newLng } : { lat: 0, lng: newLng });
                                    }
                                }}
                            />
                        </Form.Item>
                    </div>

                    <LocationPicker onLocationSelect={handleLocationSelect} location={location} />

                    <Form.Item
                        name="Address"
                        label={<span style={{ fontSize: '1.3rem' }}>Address</span>}
                        style={{ marginTop: '1.5rem', marginBottom: '0' }}
                    >
                        <Input style={{ fontSize: '1.5rem' }} placeholder="Enter address here..." />
                    </Form.Item>

                    <Form.Item
                        name="CategoryId"
                        label={<span style={{ fontSize: '1.3rem' }}>Category</span>}
                        rules={[{ required: true }]}
                        style={{ marginTop: '1.5rem' }}
                    >
                        <Cascader
                            options={categoryOptions}
                            placeholder="Select category"
                            style={{
                                height: '52px',
                                fontFamily: 'Poppins, Segoe UI, sans-serif',
                            }}
                            className={styles.cascaderInput}
                            classNames={{ popup: { root: 'dropdownPopup' } }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="CountryId"
                        label={<span style={{ fontSize: '1.3rem' }}>Country</span>}
                        rules={[{ required: true }]}
                    >
                        <Select
                            showSearch
                            className={styles.countriesSelect}
                            classNames={{ popup: { root: 'uploadCountryDropdown' } }}
                            placeholder="Start typing and select a country..."
                            optionFilterProp="label"
                            onSearch={(value) => {
                                setCountryName(value);
                                setOpenDropdown(true);
                                setSelectLoading(true);
                            }}
                            onBlur={() => {
                                setCountryOptions([]);
                                setOpenDropdown(false);
                            }}
                            options={countryOptions}

                            notFoundContent={
                                selectLoading ? (
                                    <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                                        <ConfigProvider
                                            theme={{
                                                components: {
                                                    Spin: { colorPrimary: 'green' }
                                                }
                                            }}
                                        >
                                            <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                                                <Spin style={{ transform: 'scale(1.5)' }} size="large" />
                                            </div>
                                        </ConfigProvider>
                                    </div>
                                ) : <Empty style={{ transform: 'scale(1.2)', margin: '2rem 0' }} />
                            }
                            open={openDropdown && countryName.trim() !== ''}
                            onOpenChange={(open) => {
                                if (!selectLoading) setOpenDropdown(open);
                            }}
                        />
                    </Form.Item>

                    <Form.Item name="Tags" label={<span style={{ fontSize: '1.3rem' }}>Tags</span>}>
                        <Checkbox.Group
                            style={{ width: '100%' }}
                            value={selectedTags}

                            onChange={(checkedValues) => {
                                if (checkedValues.length > 20) {
                                    return;
                                }
                                setSelectedTags(checkedValues);
                                form.setFieldsValue({ Tags: checkedValues });
                            }}
                        >
                            <div className={styles.tagCheckboxGroup}>
                                {tags.map(tag => (
                                    <Checkbox
                                        key={tag.id}
                                        value={tag.id}
                                        className={styles.customTagCheckbox}
                                        disabled={selectedTags.length >= 20 && !selectedTags.includes(tag.id)}
                                    >
                                        {tag.name}
                                    </Checkbox>
                                ))}
                            </div>
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item
                        name="Description"
                        label={<span style={{ fontSize: '1.3rem' }}>Description</span>}
                        rules={[{ required: true }, { min: 100 }, { max: 2000 }]}
                    >
                        <Input.TextArea
                            maxLength={2000}
                            placeholder="Write your best description for this place..."
                            rows={6}
                            style={{ fontSize: '1.5rem' }}
                        />
                    </Form.Item>

                    <ImageUpload />

                    <Card type="inner" className={styles.reviewCard}>

                        <Typography.Title
                            level={3}
                            style={{
                                textAlign: 'center',
                                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                                fontWeight: 700,
                                fontSize: '2.5rem',
                                letterSpacing: '0.4px',
                                color: '#1A7F64',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.6rem',
                                width: '100%',
                                marginTop: '0'
                            }}
                        >
                            <span
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '50%',
                                    padding: '0.5rem',
                                    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.12)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <CommentOutlined style={{ color: '#1A7F64', fontSize: '2rem' }} />
                            </span>
                            Review
                        </Typography.Title>

                        <Form.Item
                            style={{
                                background: '#e8faef',
                                padding: '2rem 4rem',
                                borderRadius: '16px',
                                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)',
                                margin: '0 auto',
                                width: 'fit-content',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Form.Item noStyle shouldUpdate={(prev, curr) => prev.Rating !== curr.Rating}>
                                    {({ getFieldValue }) => {
                                        const rating = getFieldValue('Rating');
                                        return rating ? (
                                            <Typography.Text
                                                style={{
                                                    background: '#f6ffed',
                                                    color: '#389e0d',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 600,
                                                    padding: '6px 16px',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                                    marginBottom: '1rem',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {['😖', '😞', '😐', '🙂', '🤩'][rating - 1]}{' '}
                                                {['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'][rating - 1]}
                                            </Typography.Text>
                                        ) : null;
                                    }}
                                </Form.Item>

                                <Form.Item
                                    name="Rating"
                                    rules={[{ required: true, message: 'Please provide a rating.' }]}
                                    noStyle
                                >
                                    <Rate allowClear={false}
                                        style={{ fontSize: '3rem' }}
                                        tooltips={['Terrible', 'Bad', 'Okay', 'Good', 'Excellent']}
                                    />
                                </Form.Item>
                            </div>
                        </Form.Item>

                        <Form.Item
                            name="ReviewContent"
                            label={<span style={{ fontSize: '1.3rem' }}>Content</span>}
                            rules={[{ required: true }, { min: 100 }, { max: 1000 }]}
                        >
                            <Input.TextArea
                                placeholder="Share your experience..."
                                rows={10}
                                maxLength={1000}
                                style={{ fontSize: '1.5rem' }}
                            />
                        </Form.Item>

                    </Card>

                    <Button
                        block
                        size="large"
                        type="primary"
                        htmlType="submit"
                        className={styles.uploadButton}
                    >
                        {
                            isPlaceUploading ?
                                <span>
                                    Uploading...
                                    <ConfigProvider theme={{
                                        components: {
                                            Spin: {
                                                colorPrimary: '#fff'
                                            }
                                        }
                                    }}>
                                        <Spin style={{ marginLeft: '10px' }} spinning={true} />
                                    </ConfigProvider>
                                </span> :
                                'Upload'
                        }
                    </Button>

                </Form>

                {/* </ConfigProvider> */}
            </div>

        </section>
    );
};

export default UploadPlace;