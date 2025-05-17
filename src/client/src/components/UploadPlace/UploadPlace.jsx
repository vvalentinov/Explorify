import styles from './UploadPlace.module.css';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

import LocationPicker from '../LocationPicker/LocationPicker';

import { fireError } from '../../utils/fireError';

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

    const [description, setDescription] = useState("");

    const [debounced] = useDebounce(countryName, 1000);

    const [location, setLocation] = useState(null);

    const handleLocationSelect = (latlng) => {
        setLocation(latlng); // { lat, lng }
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

            setSelectLoading(true);

            countriesService
                .getCountries(countryName)
                .then(res => {
                    const options = mapCountryOptions(res);
                    setCountryOptions(options);
                    setSelectLoading(false);
                }).catch(err => fireError(err));
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
                <Form onFinish={onSubmit} layout="vertical" size="large">

                    <Form.Item
                        name="Name"
                        label="Name"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter place name..." />
                    </Form.Item>

                    {location && (
                        <div style={{ marginTop: '1rem' }}>
                            <p>Latitude: {location.lat.toFixed(5)}</p>
                            <p>Longitude: {location.lng.toFixed(5)}</p>
                        </div>
                    )}

                    <LocationPicker onLocationSelect={handleLocationSelect} />

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
                            loading={selectLoading}
                            showSearch
                            placeholder="Start typing and select a country..."
                            optionFilterProp="label"
                            onSearch={onSearch}
                            onBlur={() => setCountryOptions([])}
                            options={countryOptions}
                        />

                    </Form.Item>

                    <Form.Item name="Tags" label="Tags">

                        <Checkbox.Group style={{ width: '100%' }}>
                            <div className={styles.tagCheckboxGroup}>
                                {tags.map(tag => (
                                    <Checkbox
                                        key={tag.id}
                                        value={tag.id}
                                        style={{
                                            margin: '8px',
                                            border: '1px solid green',
                                            borderRadius: '16px',
                                            padding: '6px 12px',
                                            backgroundColor: '#f1fdfa',
                                            transition: 'all 0.3s',
                                        }}
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