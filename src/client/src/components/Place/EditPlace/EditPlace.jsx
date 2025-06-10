import styles from './EditPlace.module.css';

import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

import { AuthContext } from "../../../contexts/AuthContext";

import { vibesServiceFactory } from '../../../services/vibesService';
import { placesServiceFactory } from '../../../services/placesService';
import { countriesServiceFactory } from '../../../services/countriesService';
import { categoriesServiceFactory } from '../../../services/categoriesService';

import { fireError } from '../../../utils/fireError';

import ImageUpload from '../UploadPlace/ImageUpload/ImageUpload';

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
    Typography,
    Empty
} from 'antd';
import { EditOutlined, CommentOutlined } from '@ant-design/icons';

import { useDebounce } from 'use-debounce';

import {
    findCategoryPath,
    mapCategoriesOptions,
    mapCountryOptions,
    generateFormData,
} from './editPlaceUtil';

import LocationPicker from '../../LocationPicker/LocationPicker';

const desc = ['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];
const emojis = ['😖', '😞', '😐', '🙂', '🤩'];

const EditPlace = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const [form] = Form.useForm();

    const { token } = useContext(AuthContext);

    const placesService = placesServiceFactory(token);
    const countriesService = countriesServiceFactory();
    const categoriesService = categoriesServiceFactory();
    const vibesService = vibesServiceFactory();

    const [editData, setEditData] = useState({});
    const [toBeRemovedImagesIds, setToBeRemovedImagesIds] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [countryName, setCountryName] = useState('');
    const [isPlaceEditing, setIsPlaceEditing] = useState(false);

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectLoading, setSelectLoading] = useState(false);

    const [locationMap, setLocationMap] = useState(null);
    const [isMapUpdate, setIsMapUpdate] = useState(false);

    const [debounced] = useDebounce(countryName, 1000);

    useEffect(() => {
        if (locationMap && isMapUpdate) {

            form.setFieldsValue({
                Latitude: locationMap.lat.toFixed(5),
                Longitude: locationMap.lng.toFixed(5),
            });

            setIsMapUpdate(false);
        }
    }, [locationMap]);

    useEffect(() => {

        if (location.state?.placeId) {
            placesService
                .getEditData(location.state?.placeId)
                .then(res => {

                    setEditData(res);

                    if (res.latitude != 0 && res.longitude != 0) {
                        form.setFieldsValue({
                            Latitude: res.latitude,
                            Longitude: res.longitude,
                        });

                        setLocationMap({ lat: res.latitude, lng: res.longitude });
                    }

                }).catch(err => fireError(err))
        }

        categoriesService
            .getCategoriesOptions()
            .then(res => setCategoryOptions(mapCategoriesOptions(res)))
            .catch(err => fireError(err));

        vibesService
            .getVibes()
            .then(res => setTags(res))
            .catch(err => fireError(err));

    }, []);

    useEffect(() => {

        if (editData) {

            const categoryPath = findCategoryPath(
                categoryOptions,
                editData.categoryId);

            const selectedOption = {
                value: editData.countryId,
                label: editData.countryName,
            };

            if (editData?.tagsIds && tags.length > 0) {
                setSelectedTags(editData.tagsIds);
                form.setFieldsValue({ Tags: editData.tagsIds });
            }

            setCountryOptions([selectedOption]);

            const existingImages = editData.images?.map((image, index) => ({
                uid: `existing-${image.id}`,
                name: `Image ${index + 1}`,
                status: 'done',
                url: image.url,
            }));

            form.setFieldsValue({
                Name: editData.name,
                Description: editData.description,
                Rating: editData.rating,
                ReviewContent: editData.reviewContent,
                CategoryId: categoryPath,
                Address: editData.address,
                CountryId: editData.countryId,
                Images: existingImages,
            });
        }

    }, [editData, form]);

    useEffect(() => {
        if (debounced) {
            countriesService
                .getCountries(countryName)
                .then(res => {
                    setCountryOptions(mapCountryOptions(res));
                    setSelectLoading(false);
                })
                .catch(err => {
                    fireError(err);
                    setSelectLoading(false);
                });
        }
    }, [debounced]);

    const handleLocationSelect = (latlng) => {
        setIsMapUpdate(true);
        setLocationMap(latlng);
    };

    const onSubmit = (data) => {

        setIsPlaceEditing(true);

        data.PlaceId = editData?.placeId;
        const formData = generateFormData(data, toBeRemovedImagesIds);

        // To inspect the FormData contents
        // for (let pair of formData.entries()) {
        //     console.log(`${pair[0]}:`, pair[1]);
        // }

        placesService
            .editPlace(formData)
            .then(res => {
                setIsPlaceEditing(false);
                navigate('/', { state: { successOperation: { message: res.successMessage } } })
            }).catch(err => {
                fireError(err);
                setIsPlaceEditing(false);
            });
    };

    return (
        <section className={styles.editPlaceSection}>

            <div className={styles.editPlaceCard}>

                <Typography.Title className={styles.pageTitle}><EditOutlined /> Edit Place</Typography.Title>

                <Form form={form} onFinish={onSubmit} layout="vertical" size="large">

                    <Form.Item
                        name="Name"
                        label={<span style={{ fontSize: '1.3rem' }}>Name</span>}
                        rules={[{ required: true, max: 100 }]}
                    >
                        <Input style={{ fontSize: '1.5rem' }} placeholder="Enter place name..." />
                    </Form.Item>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '2rem'
                        }}
                    >
                        <Form.Item style={{ width: '50%' }} name="Latitude" label={<span style={{ fontSize: '1.3rem' }}>Latitude</span>}>
                            <Input style={{ fontSize: '1.5rem' }}
                                onChange={(e) => {
                                    const newLat = parseFloat(e.target.value);
                                    if (!isNaN(newLat)) {
                                        setLocationMap(prev => prev ? { ...prev, lat: newLat } : { lat: newLat, lng: 0 });
                                    }
                                }}
                            />
                        </Form.Item>

                        <Form.Item style={{ width: '50%' }} name="Longitude" label={<span style={{ fontSize: '1.3rem' }}>Longitude</span>}>
                            <Input style={{ fontSize: '1.5rem' }}
                                onChange={(e) => {
                                    const newLng = parseFloat(e.target.value);
                                    if (!isNaN(newLng)) {
                                        setLocationMap(prev => prev ? { ...prev, lng: newLng } : { lat: 0, lng: newLng });
                                    }
                                }}
                            />
                        </Form.Item>
                    </div>

                    <LocationPicker onLocationSelect={handleLocationSelect} location={locationMap} />

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
                            classNames={{ popup: { root: 'customCountryDropdown' } }}
                            placeholder="Start typing and select a country..."
                            optionFilterProp="label"
                            onSearch={(value) => {
                                setCountryName(value);
                                setOpenDropdown(true);
                                setSelectLoading(true);
                            }}
                            filterOption={false}
                            onBlur={() => {
                                if (countryOptions.length === 0) {
                                    // Clear the field if no results
                                    form.setFieldsValue({ CountryId: undefined });
                                }
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
                            open={openDropdown}
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
                            rows={6}
                            maxLength={2000}
                            placeholder="Write your best description for this place..."
                            style={{ fontSize: '1.5rem' }}
                        />

                    </Form.Item>

                    <ImageUpload setToBeRemovedImagesIds={setToBeRemovedImagesIds} />

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
                                width: '100%'
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
                        variant='solid'
                        color='cyan'
                        htmlType="submit"
                        className={styles.uploadButton}
                    >
                        {
                            isPlaceEditing ?
                                <span>
                                    Editing...
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
                                'Edit'
                        }
                    </Button>

                </Form>
            </div>

        </section>
    );

};

export default EditPlace;