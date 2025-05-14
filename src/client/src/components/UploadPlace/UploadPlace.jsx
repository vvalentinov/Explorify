import styles from './UploadPlace.module.css';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

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
    Spin
} from 'antd';

import { UploadOutlined } from '@ant-design/icons';

import { useDebounce } from 'use-debounce';

import { homePath } from '../../constants/paths';
import { AuthContext } from '../../contexts/AuthContext';
import { placesServiceFactory } from '../../services/placesService';
import { countriesServiceFactory } from '../../services/countriesService';
import { categoriesServiceFactory } from '../../services/categoriesService';

import ImageUpload from '../ImageUpload/ImageUpload';

const UploadPlace = () => {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const placesService = placesServiceFactory(token);
    const countriesService = countriesServiceFactory();
    const categoriesService = categoriesServiceFactory();

    const [countryName, setCountryName] = useState('');
    const [countryOptions, setCountryOptions] = useState([]);
    const [selectLoading, setSelectLoading] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const [debounced] = useDebounce(countryName, 1000);

    useEffect(() => {
        if (categoryOptions.length == 0) {
            categoriesService
                .getCategoriesOptions()
                .then(res => {
                    const options = res.map(category => ({
                        value: category.id,
                        label: category.name,
                        children: category.subcategories.map(child => ({
                            value: child.id,
                            label: child.name,
                        })),
                    }));
                    setCategoryOptions(options);
                }).catch(err => console.log(err));
        }

        if (debounced) {
            setSelectLoading(true);

            countriesService
                .getCountries(countryName)
                .then(res => {
                    const options = res.map(country => ({
                        value: country.id,
                        label: country.name,
                    }));

                    setCountryOptions(options);
                    setSelectLoading(false);
                }).catch(err => console.log(err));
        }

    }, [debounced])

    const [isPlaceUploading, setIsPlaceUploading] = useState(false);

    const onSubmit = (data) => {

        setIsPlaceUploading(true);

        const formData = new FormData();

        formData.append("Name", data.Name ?? "");
        formData.append("Address", data.Address ?? "");
        formData.append("Description", data.Description);
        formData.append("CategoryId", data.CategoryId[0]);
        formData.append("SubcategoryId", data.CategoryId[1]);
        formData.append("CountryId", data.CountryId);
        formData.append("ReviewRating", data.Rating);
        formData.append("ReviewContent", data.ReviewContent);

        data.Images?.forEach(file => {
            if (file.originFileObj) { formData.append("Files", file.originFileObj); }
        });

        placesService
            .uploadPlace(formData)
            .then(res => {
                setIsPlaceUploading(false);
                navigate(homePath, {
                    state: {
                        successOperation:
                        {
                            message: 'Successfull place upload!'
                        }
                    }
                });
            }).catch(err => {
                setIsPlaceUploading(false);
                fireError(err);
            });
    }

    const onSearch = value => setCountryName(value);

    return (
        <ConfigProvider theme={{
            components: {
                Input: {
                    activeShadow: '#13c2c2',
                    colorPrimary: '#13c2c2',
                    hoverBorderColor: '#13c2c2'
                },
                Select: {
                    activeBorderColor: '#13c2c2',
                    hoverBorderColor: '#13c2c2',
                },
                Cascader: {
                    controlItemBgHover: '#e6fffb',
                    controlHeight: 40,
                    controlOutlineWidth: 2,
                    controlOutline: '#13c2c2',
                    colorPrimary: '#13c2c2',
                    controlItemBgActive: '#e6fffb',
                },
            }
        }}>
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
                    <Form
                        onFinish={onSubmit}
                        layout="vertical"
                        size="large"
                    >
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
                        // rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter address here..." />
                        </Form.Item>

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
                                loading={selectLoading}
                                showSearch
                                placeholder="Type and select a country..."
                                optionFilterProp="label"
                                onSearch={onSearch}
                                onBlur={() => setCountryOptions([])}
                                options={countryOptions}
                            />

                        </Form.Item>

                        <Form.Item
                            name="Description"
                            label="Description"
                        // rules={[{ required: true }, { min: 100 }, { max: 2000 }]}
                        >
                            <Input.TextArea showCount placeholder="Write your best description for this place..." rows={6} />
                        </Form.Item>

                        <ImageUpload />

                        <Card
                            title="Review"
                            type="inner"
                            style={{
                                marginTop: 24,
                                marginBottom: 20,
                                backgroundColor: '#faf5ff',
                                border: '1px solid #d3adf7',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                            }}
                        >

                            <Form.Item
                                name="Rating"
                                label="Rating"
                            // rules={[{ required: true, message: 'Please give a rating!' }]}
                            >
                                <Rate id="Rating" allowClear />
                            </Form.Item>

                            <Form.Item
                                name="ReviewContent"
                                label="Content"
                            // rules={[
                            //     { required: true, message: 'Please write a review!' },
                            //     { min: 100 },
                            //     { max: 1000 }
                            // ]}
                            >
                                <Input.TextArea
                                    placeholder="Share your experience..."
                                    rows={10}
                                    showCount
                                />
                            </Form.Item>
                        </Card>

                        <Button
                            type="primary"
                            size="large"
                            block
                            htmlType="submit"
                            className={styles.uploadButton}
                        >
                            {isPlaceUploading ? <span>Uploading...  <ConfigProvider theme={{
                                components: {
                                    Spin: {
                                        colorPrimary: 'white'
                                    }
                                }
                            }}>
                                <Spin style={{ marginLeft: '10px' }} spinning={true} />
                            </ConfigProvider></span> :
                                'Upload'}
                        </Button>

                    </Form>
                </Card>
            </section>
        </ConfigProvider>
    );
};

export default UploadPlace;