import { useState } from 'react';

import {
    Card,
    Rate,
    Modal,
    Button,
    Form,
    Input,
    Upload,
    App,
} from 'antd';

import { UploadOutlined } from '@ant-design/icons';

import { reviewsServiceFactory } from '../../services/reviewsService';

const UploadReviewModal = ({
    token,
    isModalOpen,
    setIsModalOpen,
    placeId
}) => {

    const { notification } = App.useApp();

    const reviewService = reviewsServiceFactory(token);

    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFileList([]);
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-5));
    };

    const handleReviewSubmit = (values) => {

        const formData = new FormData();

        formData.append("Rating", values.Rating ?? "");
        formData.append("Content", values.Content);
        formData.append("PlaceId", placeId);

        fileList.forEach(file => {
            if (file.originFileObj) { formData.append("Files", file.originFileObj); }
        });

        reviewService
            .uploadReview(formData)
            .then(res => {
                notification.success({
                    message: 'Review Submitted',
                    description: 'Your review has been submitted successfully and is pending approval.',
                    placement: 'topRight',
                    duration: 5,
                });
            }).catch(err => fireError(err));

        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <Modal
            title="Write Your Review"
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={null}
            width={700}
            style={{ top: 20 }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleReviewSubmit}
            >
                <Card
                    style={{
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#e8fffb',
                        borderRadius: '12px',
                        border: '1px solid green',
                        marginTop: '1rem',
                    }}
                    title={
                        <span>
                            Upload Images
                        </span>
                    }
                >
                    <Form.Item
                        style={{
                            border: '1px dashed #91d5ff',
                            padding: '1rem',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false}
                            multiple
                            maxCount={5}
                        >
                            <Button
                                color='cyan'
                                variant='solid'
                                size='large'
                                icon={<UploadOutlined />}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 500,
                                }}
                            >
                                Select Up To 5 Images
                            </Button>
                        </Upload>
                    </Form.Item>
                </Card>


                <Card style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#e8fffb',
                    borderRadius: '12px',
                    border: '1px solid green',
                    margin: '2rem 0',
                }}>

                    <Form.Item
                        name="Rating"
                        label="Your Rating"
                        rules={[{ required: true }]}
                        colon={false}
                    >
                        <Rate id='Your Rating' allowClear={true} />
                    </Form.Item>

                    <Form.Item
                        name="Content"
                        label="Your Content"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea showCount={true} rows={8} placeholder="Share your thoughts..." />
                    </Form.Item>

                </Card>

                <Form.Item>
                    <Button
                        color='cyan'
                        variant='solid'
                        size='large'
                        htmlType="submit"
                        block
                    >
                        Submit Review
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UploadReviewModal;