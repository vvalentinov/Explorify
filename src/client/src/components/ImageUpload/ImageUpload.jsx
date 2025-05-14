import styles from './ImageUpload.module.css';

import { Form, Image, Upload, Button, App, ConfigProvider } from "antd";

import { useState } from "react";

import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

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

const validTypes = ['image/jpeg', 'image/png'];

const normFile = e => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const ImageUpload = () => {

    const { message } = App.useApp();

    // state
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const beforeUpload = (file) => {

        const isValid = validTypes.includes(file.type);

        if (!isValid) {
            message.error(`File "${file.name}" is not a valid image.`);
        }

        const isDuplicate = fileList.some(f => f.name === file.name);
        if (isDuplicate) {
            message.error(`File "${file.name}" has already been selected.`);
            return Upload.LIST_IGNORE;
        }

        const isTooLarge = file.size > 5 * 1024 * 1024; // 5 MB in bytes
        if (isTooLarge) {
            message.error(`File "${file.name}" is too large. Maximum size is 5MB.`);
            return Upload.LIST_IGNORE;
        }

        return isValid ? false : Upload.LIST_IGNORE;

    };

    const handleFileChange = ({ fileList: newFileList }) => {
        const updatedList = newFileList
            .slice(-10)
            .map(file => ({
                ...file,
                status: 'done',
                thumbUrl: file.thumbUrl || (file.originFileObj && URL.createObjectURL(file.originFileObj)),
            }));

        setFileList(updatedList);
    };

    const handlePreview = file =>
        __awaiter(void 0, void 0, void 0, function* () {
            if (!file.url && !file.preview) {
                file.preview = yield getBase64(file.originFileObj);
            }
            setPreviewImage(file.url || file.preview);
            setPreviewOpen(true);
        });

    return (
        <>
            <Form.Item
                name="Images"
                label="Upload Images"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                required={true}
            >

                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleFileChange}
                    beforeUpload={beforeUpload}
                    multiple
                    maxCount={10}
                    onPreview={handlePreview}
                >

                    <PlusOutlined />
                    <span style={{ marginLeft: '5px', fontSize: '1.1rem' }}>Upload</span>

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

        </>
    )
};

export default ImageUpload;