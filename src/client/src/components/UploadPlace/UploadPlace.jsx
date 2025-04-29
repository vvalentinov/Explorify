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
    ConfigProvider
} from 'antd';

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

    const onSubmit = (data) => {
        const formData = new FormData();

        formData.append("Name", data.Name ?? "");
        formData.append("Description", data.Description);
        formData.append("CategoryId", data.CategoryId[0]);
        formData.append("SubcategoryId", data.CategoryId[1]);
        formData.append("CountryId", data.CountryId);

        data.Images?.forEach(file => {
            if (file.originFileObj) { formData.append("Files", file.originFileObj); }
        });

        placesService
            .uploadPlace(formData)
            .then(res => navigate(homePath, { state: { successfullPlaceUpload: true } }))
            .catch(err => fireError(err));
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
                <Card className={styles.uploadPlaceCard} title="Upload a New Place">
                    <Form
                        onFinish={onSubmit}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="Name"
                            label="Name"
                            rules={[{ required: true, message: 'Please provide a name!' }]}
                        >
                            <Input placeholder="Enter place name..." />
                        </Form.Item>

                        <Form.Item
                            name="CategoryId"
                            label="Category"
                            rules={[{ required: true, message: 'Please select a category!' }]}
                        >
                            <Cascader options={categoryOptions} changeOnSelect placeholder="Select category" />
                        </Form.Item>

                        <Form.Item
                            name="CountryId"
                            label="Country"
                            rules={[{ required: true, message: 'Please select a country!' }]}
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
                            rules={[
                                { required: true, message: 'Please write a description!' },
                                { min: 50, message: 'Minimum 50 characters!' },
                                { max: 500, message: 'Maximum 500 characters!' }
                            ]}
                        >
                            <Input.TextArea placeholder="Write your best description for this place..." rows={6} />
                        </Form.Item>

                        <ImageUpload />

                        <Button
                            color='cyan'
                            variant='solid'
                            size='large'
                            block="true"
                            htmlType="submit">
                            Upload
                        </Button>

                    </Form>
                </Card>
            </section>
        </ConfigProvider>
    );
};

export default UploadPlace;