import { useState } from 'react';

import {
    Card,
    Rate,
    Modal,
    Button,
    Form,
    Input,
    App,
} from 'antd';

import { fireError } from '../../../utils/fireError';

import UploadReviewImages from './UploadReviewImages';

const UploadReviewModal = ({
    isModalOpen,
    setIsModalOpen,
    placeId,
    reviewService
}) => {

    const { notification } = App.useApp();

    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFileList([]);
        form.resetFields();
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
                    duration: 0,
                });
            }).catch(err => fireError(err));

        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={null}
            width={1000}
            style={{ top: '10px' }}
            centered
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
                        marginTop: '2.5rem',
                    }}
                    title={
                        <span style={{ fontSize: '1.5rem' }}>
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
                        <UploadReviewImages fileList={fileList} onFileChange={handleFileChange} />

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
                        label={<span style={{ fontSize: '1.5rem' }}>Your Rating</span>}
                        rules={[{ required: true }]}
                        colon={false}
                    >
                        <Rate style={{ fontSize: '3rem' }} id='Your Rating' allowClear={true} />
                    </Form.Item>

                    <Form.Item
                        name="Content"
                        label={<span style={{ fontSize: '1.5rem' }}>Your Content</span>}
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea style={{ fontSize: '1.5rem' }} rows={8} placeholder="Share your thoughts..." />
                    </Form.Item>

                </Card>

                <Form.Item>
                    <Button
                        color='cyan'
                        variant='solid'
                        size='large'
                        htmlType="submit"
                        block
                        style={{ fontSize: '1.5rem', padding: '2rem 0' }}
                    >
                        Submit Review
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UploadReviewModal;