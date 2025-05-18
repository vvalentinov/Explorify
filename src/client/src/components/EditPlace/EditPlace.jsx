import styles from './EditPlace.module.css';

import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import { vibesServiceFactory } from '../../services/vibesService';
import { placesServiceFactory } from '../../services/placesService';
import { countriesServiceFactory } from '../../services/countriesService';
import { categoriesServiceFactory } from '../../services/categoriesService';

import { fireError } from '../../utils/fireError';

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

import { useDebounce } from 'use-debounce';

import { UploadOutlined, EditOutlined } from '@ant-design/icons';

const mapCategoriesOptions = (categories) => {

    const options = categories.map(category => ({
        value: category.id,
        label: category.name,
        children: category.subcategories.map(child => ({
            value: child.id,
            label: child.name,
        })),
    }));

    return options;

};

const mapCountryOptions = (countries) => {

    const options = countries.map(country => ({
        value: country.id,
        label: country.name,
    }));

    return options;
};

function findCategoryPath(options, targetValue) {
    for (const option of options) {
        if (option.value === targetValue) return [option.value];
        if (option.children) {
            const childPath = findCategoryPath(option.children, targetValue);
            if (childPath) return [option.value, ...childPath];
        }
    }
    return null;
}



const EditPlace = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [form] = Form.useForm();

    const { token } = useContext(AuthContext);

    const placesService = placesServiceFactory(token);
    const countriesService = countriesServiceFactory();
    const categoriesService = categoriesServiceFactory();

    const [editData, setEditData] = useState({});

    const [toBeRemovedImagesIds, setToBeRemovedImagesIds] = useState([]);

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [countryName, setCountryName] = useState('');

    const [debounced] = useDebounce(countryName, 1000);

    const generateFormData = (data) => {

        const formData = new FormData();

        formData.append("Name", data.Name ?? "");
        formData.append("Address", data.Address ?? "");
        formData.append("Description", data.Description);
        formData.append("CategoryId", data.CategoryId[0]);
        formData.append("SubcategoryId", data.CategoryId[1]);
        formData.append("CountryId", data.CountryId);
        formData.append("ReviewRating", data.Rating);
        formData.append("ReviewContent", data.ReviewContent);
        toBeRemovedImagesIds.forEach(id => {
            formData.append('ToBeRemovedImagesIds', id);
        });

        data.Images?.forEach(file => {
            if (file.originFileObj) {
                formData.append("NewImages", file.originFileObj);
            }
        });

        // if (data.Tags?.length > 0) {
        //     data.Tags.forEach(tagId => {
        //         formData.append("VibesIds", tagId);
        //     });
        // }

        return formData;
    };

    useEffect(() => {
        if (location.state?.placeId) {
            placesService
                .getEditData(location.state?.placeId)
                .then(res => {
                    setEditData(res);
                })
                .catch(err => {
                    fireError(err);
                })
        }

        categoriesService
            .getCategoriesOptions()
            .then(res => {
                const options = mapCategoriesOptions(res);
                setCategoryOptions(options);
            }).catch(err => fireError(err));
    }, []);

    useEffect(() => {

        if (editData) {
            const categoryPath = findCategoryPath(categoryOptions, editData.categoryId);

            const selectedOption = {
                value: editData.countryId,
                label: editData.countryName,
            };
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
                    const options = mapCountryOptions(res);
                    setCountryOptions(options);
                }).catch(err => fireError(err));
        }

    }, [debounced]);

    const onSubmit = (data) => {
        const formData = generateFormData(data);

        console.log(Object.fromEntries(formData.entries()));

        placesService.editPlace(formData).then(res => console.log(res)).catch(err => console.log(err));
    };

    const onSearch = value => setCountryName(value);

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
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="Enter place name..." />
                    </Form.Item>

                    {/* {location && (
                        <div style={{ marginTop: '1rem' }}>
                            <p>Latitude: {location.lat.toFixed(5)}</p>
                            <p>Longitude: {location.lng.toFixed(5)}</p>
                        </div>
                    )} */}

                    {/* <LocationPicker onLocationSelect={handleLocationSelect} /> */}

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
                            // loading={selectLoading}
                            allowClear={true}
                            showSearch
                            placeholder="Start typing and select a country..."
                            optionFilterProp="label"
                            onSearch={onSearch}
                            onBlur={() => setCountryOptions([])}
                            options={countryOptions}
                        />

                    </Form.Item>

                    {/* <Form.Item name="Tags" label="Tags">

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

                    </Form.Item> */}

                    <Form.Item
                        name="Description"
                        label="Description"
                        rules={[{ required: true }, { min: 100 }, { max: 2000 }]}
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

                    <Button htmlType='submit' block>Edit</Button>

                    {/* <Button
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
                    </Button> */}

                </Form>
            </Card>

        </section>
    );

};

export default EditPlace;