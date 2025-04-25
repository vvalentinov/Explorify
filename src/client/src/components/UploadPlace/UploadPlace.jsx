import styles from './UploadPlace.module.css';

import { useState, useEffect, useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { PlusOutlined } from '@ant-design/icons';

import {
    Button,
    Cascader,
    Form,
    Input,
    Select,
    FloatButton,
    Upload,
    Image
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
import { placesServiceFactory } from '../../services/placesService';

import { AuthContext } from '../../contexts/AuthContext';

import { homePath } from '../../constants/paths';

var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

const UploadPlace = () => {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const categoriesService = categoriesServiceFactory();
    const countriesService = countriesServiceFactory();
    const placesService = placesServiceFactory(token);

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);

    const [countryName, setCountryName] = useState('');

    const [selectLoading, setSelectLoading] = useState(false);

    const [debounced] = useDebounce(countryName, 1000);

    // images
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const handlePreview = file =>
        __awaiter(void 0, void 0, void 0, function* () {
            if (!file.url && !file.preview) {
                file.preview = yield getBase64(file.originFileObj);
            }
            setPreviewImage(file.url || file.preview);
            setPreviewOpen(true);
        });
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <button style={{ border: 0, background: 'none', cursor: 'pointer' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Images</div>
        </button>
    );

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
        const formData = new FormData();

        formData.append("Name", data.Name ?? "");
        formData.append("Description", data.Description);
        formData.append("CategoryId", data.CategoryId[0]);
        formData.append("SubcategoryId", data.CategoryId[1]);
        formData.append("CountryId", data.CountryId);

        data.Images.forEach(file => {
            if (file.originFileObj) {
                formData.append("Files", file.originFileObj);
            }
        });

        placesService
            .uploadPlace(formData)
            .then(res => {
                navigate(homePath, { state: { successfullPlaceUpload: true } });
                console.log(res);
            }).catch(err => console.log(err));
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
                // rules={[{ required: true, message: 'Provide a name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="CategoryId"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Cascader options={categoryOptions} changeOnSelect />
                </Form.Item>
                <Form.Item
                    name='CountryId'
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
                        placeholder="Type a country name..."
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
                <Form.Item
                    name="Images"
                    // label="Upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload
                        beforeUpload={() => false}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                </Form.Item>

                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: visible => setPreviewOpen(visible),
                            afterOpenChange: visible => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}

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