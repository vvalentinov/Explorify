import { Upload, message, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

const UploadImages = () => {

    // State Management
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    const isDuplicate = (file, list) => list.some((f) => f.name === file.name && f.size === file.size);

    const handlePreview = async (file) => {

        const getBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        };

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList.slice(0, 5));

    const beforeUpload = (file) => {

        const isValid = validTypes.includes(file.type);

        if (!isValid) {

            message.error({
                content: `File "${file.name}" is not a valid image.`,
                className: 'custom-message',
                duration: 3
            });
        }

        if (isDuplicate(file, fileList)) {
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

    const renderUploadButton = (
        <div style={{ transform: 'scale(1.5)' }}>
            <PlusOutlined />
            <div>Upload</div>
        </div>
    );

    return (

        <>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                multiple
                className="largeUpload"
                onPreview={handlePreview}
            >
                {fileList.length >= 5 ? null : renderUploadButton}
            </Upload>

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
    );
};

export default UploadImages;
