import { Form, Image, Upload, App } from "antd";

import { useState } from "react";

import { PlusOutlined } from '@ant-design/icons';

import styles from './ImageUpload.module.css';

import { getBase64, normFile } from './imageUploadUtil';

const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

const ImageUpload = ({ setToBeRemovedImagesIds }) => {

    const { message } = App.useApp();

    // State Management
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

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

        const isTooLarge = file.size > 5 * 1024 * 1024;

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

    const handlePreview = async (file) => {

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleRemove = (file) => {
        if (file?.uid?.startsWith('existing')) {
            let index = file.uid.indexOf('-');
            let id = parseInt(file.uid.substring(index + 1));
            setToBeRemovedImagesIds(prev => [...prev, id]);
        }
    }

    return (
        <>
            <Form.Item
                name="Images"
                label={<span style={{ fontSize: '1.3rem' }}>Images</span>}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                required={true}
            >

                <Upload
                    accept="image/*"
                    multiple
                    maxCount={10}
                    fileList={fileList}
                    listType="picture-card"
                    onPreview={handlePreview}
                    onChange={handleFileChange}
                    beforeUpload={beforeUpload}
                    onRemove={handleRemove}
                    className={styles.uploadCard}
                >

                    {fileList.length < 10 && (
                        <div className={styles.customUploadButton}>
                            <PlusOutlined style={{ fontSize: 20 }} />
                            <span style={{ fontSize: '1.1rem', marginTop: 8 }}>Upload</span>
                        </div>
                    )}

                </Upload>

            </Form.Item>

            {previewImage && (
                <Image
                    src={previewImage}
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: visible => setPreviewOpen(visible),
                        afterOpenChange: visible => !visible && setPreviewImage(''),
                    }}
                />
            )}

        </>
    )
};

export default ImageUpload;