import { Form, Image, Upload, App, Card, Button } from "antd";

import { useState } from "react";

import { PlusOutlined } from '@ant-design/icons';

import { motion } from "framer-motion";

import { getBase64, normFile } from './imageUploadUtil';

const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

const ImageUpload = ({ setToBeRemovedImagesIds }) => {

    const { message } = App.useApp();

    // State Management
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    const beforeUpload = (file) => {

        // const isValid = validTypes.includes(file.type);

        // if (!isValid) {
        //     message.error(`File "${file.name}" is not a valid image.`);
        // }

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
        <Card style={{ margin: '2rem 0' }}>
            <Form.Item
                name="Images"
                label="Upload Images"
                valuePropName="fileList"
                getValueFromEvent={normFile}
            // required={true}
            >

                <Upload
                    multiple
                    // maxCount={10}
                    fileList={fileList}
                    listType="picture-card"
                    onPreview={handlePreview}
                    onChange={handleFileChange}
                    beforeUpload={beforeUpload}
                    onRemove={handleRemove}
                >

                    <motion.div
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 100,
                            height: 100,
                            border: '1px dashed #d9d9d9',
                            borderRadius: 4,
                            backgroundColor: '#fafafa',
                            cursor: 'pointer',
                        }}
                    >
                        {/* <PlusOutlined style={{ fontSize: 24 }} /> */}
                        <span style={{ fontSize: '0.9rem', marginTop: 8 }}>Upload</span>
                    </motion.div>

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

        </Card>
    )
};

export default ImageUpload;