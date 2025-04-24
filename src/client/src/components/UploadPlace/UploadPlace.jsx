import styles from './UploadPlace.module.css';

import { useState, useEffect } from 'react';

import { PlusOutlined } from '@ant-design/icons';

import {
    Button,
    Cascader,
    Checkbox,
    ColorPicker,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Rate,
    Select,
    Slider,
    Switch,
    TreeSelect,
    Upload,
} from 'antd';

import { useDebounce } from 'use-debounce';
const { TextArea } = Input;

const normFile = e => {
    if (Array.isArray(e)) {
        return e;
    }
    return e === null || e === void 0 ? void 0 : e.fileList;
};

import { categoriesServiceFactory } from '../../services/categoriesService';
import { countriesServiceFactory } from '../../services/countriesService';

const UploadPlace = () => {

    const categoriesService = categoriesServiceFactory();
    const countriesService = countriesServiceFactory();

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);

    const [countryName, setCountryName] = useState('');

    const [selectLoading, setSelectLoading] = useState(false);

    const [debounced] = useDebounce(countryName, 1000);

    useEffect(() => {
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
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
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
                })
                .catch(err => console.log(err));
        }

    }, [debounced]);

    const onSubmit = (data) => {
        console.log(data);
    }

    const onChange = value => {
        console.log(value);
    };

    const onSearch = value => setCountryName(value);

    return (
        <section className={styles.uploadPlaceSection}>
            <Form
                onFinish={onSubmit}
                layout="vertical"
                style={{ width: '50%', padding: '1rem 0' }}>
                <Form.Item
                    name="Name"
                    label="Name"
                    rules={[{ required: true, message: 'Provide a name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="Category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Cascader options={categoryOptions} changeOnSelect />
                </Form.Item>
                <Form.Item
                    name='Country'
                    label='Country'
                    rules={[
                        {
                            required: true,
                            message: 'Please select a country!'
                        }
                    ]}>
                    <Select
                        loading={selectLoading}
                        showSearch
                        placeholder="Select a country"
                        optionFilterProp="label"
                        onChange={onChange}
                        onSearch={onSearch}
                        onBlur={() => setCountryOptions([])}
                        options={countryOptions}
                    />
                </Form.Item>
                <Form.Item
                    name="Description"
                    label="Description"
                    rules={[
                        {
                            required: true,
                            message: 'Provide a description!'
                        },
                        {
                            min: 50,
                            message: 'Description must be between 50 and 500 characters!'
                        },
                        {
                            max: 500,
                            message: 'Description must be between 50 and 500 characters!'
                        },
                    ]}
                >
                    <TextArea placeholder='Write your best description for this place...' rows={8} />
                </Form.Item>
                <Button
                    color='cyan'
                    variant='solid'
                    size='large'
                    block="true"
                    htmlType="submit">
                    Upload
                </Button>
            </Form>
        </section>
    );
};

export default UploadPlace;