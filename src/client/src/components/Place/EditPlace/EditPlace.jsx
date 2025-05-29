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
    Checkbox
} from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { useDebounce } from 'use-debounce';

import {
    findCategoryPath,
    mapCategoriesOptions,
    mapCountryOptions,
    generateFormData,
} from './editPlaceUtil';

import LocationPicker from '../../LocationPicker/LocationPicker';

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
                .then(res => setCountryOptions(mapCountryOptions(res)))
                .catch(err => fireError(err));
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

            <Card
                className={styles.editPlaceCard}
                title={<span><EditOutlined /> Edit Place</span>}
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
                    // rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter place name..." />
                    </Form.Item>

                    <Form.Item
                        name="Address"
                        label="Address"
                    >
                        <Input placeholder="Enter address here..." />
                    </Form.Item>


                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
                        <Form.Item style={{ width: '50%' }} name="Latitude" label="Latitude">
                            <Input
                                onChange={(e) => {
                                    const newLat = parseFloat(e.target.value);
                                    if (!isNaN(newLat)) {
                                        setLocationMap(prev => prev ? { ...prev, lat: newLat } : { lat: newLat, lng: 0 });
                                    }
                                }}
                            />
                        </Form.Item>

                        <Form.Item style={{ width: '50%' }} name="Longitude" label="Longitude">
                            <Input
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
                        name="CategoryId"
                        label="Category"
                    // rules={[{ required: true }]}
                    >
                        <Cascader
                            options={categoryOptions}
                            placeholder="Select category"
                        />

                    </Form.Item>

                    <Form.Item
                        name="CountryId"
                        label="Country"
                    // rules={[{ required: true }]}
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
                    // rules={[{ required: true }, { min: 100 }, { max: 2000 }]}
                    >

                        <Input.TextArea
                            rows={6}
                            maxLength={2000}
                            placeholder="Write your best description for this place..."
                        />

                    </Form.Item>

                    <ImageUpload setToBeRemovedImagesIds={setToBeRemovedImagesIds} />

                    <Card title="Review" type="inner" className={styles.reviewCard}>

                        <Form.Item
                            name="Rating"
                            label="Rating"
                        // rules={[{ required: true }]}
                        >
                            <Rate id="Rating" allowClear />
                        </Form.Item>

                        <Form.Item
                            name="ReviewContent"
                            label="Content"
                        // rules={[{ required: true }, { min: 100 }, { max: 1000 }]}
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
                        variant='solid'
                        color='cyan'
                        htmlType="submit"
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
            </Card>

        </section>
    );

};

export default EditPlace;