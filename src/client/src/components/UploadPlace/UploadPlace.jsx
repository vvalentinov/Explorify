import styles from './UploadPlace.module.css';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

import LocationPicker from '../LocationPicker/LocationPicker';

import { fireError } from '../../utils/fireError';

import { motion } from 'framer-motion';

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
} from 'antd';

import { UploadOutlined } from '@ant-design/icons';

import { useDebounce } from 'use-debounce';

import { homePath } from '../../constants/paths';
import { AuthContext } from '../../contexts/AuthContext';
import { vibesServiceFactory } from '../../services/vibesService';
import { placesServiceFactory } from '../../services/placesService';
import { countriesServiceFactory } from '../../services/countriesService';
import { categoriesServiceFactory } from '../../services/categoriesService';

import ImageUpload from './ImageUpload/ImageUpload';

import { mapCountryOptions, mapCategoriesOptions, generateFormData } from './uploadPlaceUtil';

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

    const [debounced] = useDebounce(countryName, 1000);

    const [location, setLocation] = useState(null);

    const [isMapUpdate, setIsMapUpdate] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(false);

    useEffect(() => {
        if (!location) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const currentLocation = { lat: latitude, lng: longitude };

                    setLocation(currentLocation);
                    form.setFieldsValue({
                        Latitude: latitude.toFixed(5),
                        Longitude: longitude.toFixed(5)
                    });
                },
                (error) => {
                    console.warn('Geolocation error:', error);
                    // Optional: Show a warning to the user with AntD message
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        }
    }, []);

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

        console.log(data.Description);
        console.log(data.Description.length);
    }

    const onSearch = value => setCountryName(value);

    return (
        <section className={styles.uploadPlaceSection}>

            <Card
                className={styles.uploadPlaceCard}
                title={<span><UploadOutlined /> Upload Place</span>}
                styles={{
                    header: {
                        backgroundColor: '#f0fdfa',
                        borderRadius: '16px 16px 0 0',
                        borderBottom: 'solid 1px green'
                    }
                }}
            >
                <Form form={form} onFinish={onSubmit} layout="vertical" size="large">

                    <Form.Item
                        name="Name"
                        label="Name"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter place name..." />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
                        <Form.Item style={{ width: '50%' }} name="Latitude" label="Latitude">
                            <Input
                                onChange={(e) => {
                                    const newLat = parseFloat(e.target.value);
                                    if (!isNaN(newLat)) {
                                        setLocation(prev => prev ? { ...prev, lat: newLat } : { lat: newLat, lng: 0 });
                                    }
                                }}
                            />
                        </Form.Item>

                        <Form.Item style={{ width: '50%' }} name="Longitude" label="Longitude">
                            <Input
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
                        label="Address"
                    >
                        <Input placeholder="Enter address here..." />
                    </Form.Item>

                    <Form.Item
                        name="CategoryId"
                        label="Category"
                        rules={[{ required: true }]}
                    >
                        <Cascader
                            options={categoryOptions}
                            placeholder="Select category"
                        />

                    </Form.Item>

                    <Form.Item
                        name="CountryId"
                        label="Country"
                        rules={[{ required: true }]}
                    >
                        <Select
                            showSearch
                            allowClear={true}
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
                            notFoundContent={selectLoading ? (
                                <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                                    <ConfigProvider theme={{
                                        components: {
                                            Spin: {
                                                colorPrimary: 'green'
                                            }
                                        }
                                    }}>
                                        <Spin size="large" />
                                    </ConfigProvider>
                                </div>
                            ) : null}
                            open={openDropdown}
                            onOpenChange={(open) => {
                                // Don't allow dropdown to close if we're still loading
                                if (!selectLoading) setOpenDropdown(open);
                            }}
                        />
                    </Form.Item>

                    <Form.Item name="Tags" label="Tags">
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
                        label="Description"
                        rules={[{ required: true }, { min: 100 }, { max: 2000 }]}
                    >
                        {/* <Input.TextArea
                            showCount
                            placeholder="Write your best description for this place..."
                            rows={6}
                        /> */}

                        <Input.TextArea
                            // value={description}
                            // onChange={(e) => setDescription(e.target.value)}
                            maxLength={2000}
                            placeholder="Write your best description for this place..."
                            rows={6}
                        />

                    </Form.Item>

                    <ImageUpload />

                    <Card title="Review" type="inner" className={styles.reviewCard}>

                        <Form.Item
                            name="Rating"
                            label="Rating"
                            rules={[{ required: true }]}
                        >
                            <Rate id="Rating" allowClear />
                        </Form.Item>

                        <Form.Item
                            name="ReviewContent"
                            label="Content"
                            rules={[{ required: true }, { min: 100 }, { max: 1000 }]}
                        >
                            <Input.TextArea
                                placeholder="Share your experience..."
                                rows={10}
                                maxLength={1000}
                                style={{ fontSize: '1.1rem' }}
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
            </Card>

        </section>
    );
};

export default UploadPlace;