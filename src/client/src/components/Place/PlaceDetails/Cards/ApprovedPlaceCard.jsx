import {
    Card,
    Typography,
    Button,
    Divider,
} from 'antd';

import {
    CloseCircleOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

import { useState } from 'react';

import UnapprovePlaceModal from '../Modals/UnapprovePlaceModal';
import DeletePlaceModal from '../Modals/DeletePlaceModal';

const ApprovedPlaceCard = ({ place }) => {

    const [isUnapproveModalVisible, setIsUnapproveModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const onUnapprovePlace = () => setIsUnapproveModalVisible(true);
    const onDeletePlace = () => setIsDeleteModalVisible(true);

    return (
        <Card
            style={{
                margin: '2rem 20rem',
                backgroundColor: '#fff1f0',
                border: '1px solid #ffa39e',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                textAlign: 'center',
                padding: '2rem',
            }}
        >
            <Typography.Title level={3} style={{ color: '#cf1322', marginBottom: '1rem', fontSize: '3rem' }}>
                Unapprove This Place?
            </Typography.Title>
            <Typography.Paragraph style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '2rem' }}>
                If you've changed your mind or found an issue with this place, you can unapprove it. This will remove it from public listings.
            </Typography.Paragraph>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Button
                    type="primary"
                    danger
                    size="large"
                    icon={<CloseCircleOutlined />}
                    style={{
                        padding: '2rem 2.5rem',
                        boxShadow: '0 4px 10px rgba(255, 77, 79, 0.3)',
                        borderRadius: '999px',
                        fontSize: '1.5rem'
                    }}
                    onClick={() => onUnapprovePlace()}
                >
                    Unapprove
                </Button>
            </div>

            <Divider size='large' />

            <Typography.Title level={3} style={{ color: '#cf1322', marginBottom: '1rem', fontSize: '3rem' }}>
                Delete This Place?
            </Typography.Title>
            <Typography.Paragraph style={{ fontSize: '1.2rem', color: '#4b5563' }}>
                If you've changed your mind or found an issue with this place, you can delete it.
            </Typography.Paragraph>
            <Typography.Paragraph style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '2rem' }}>
                This will mark the place as deleted. You will have a time window to revert it back.
            </Typography.Paragraph>

            <div style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Button
                    danger
                    size="large"
                    icon={<DeleteOutlined />}
                    style={{
                        backgroundColor: '#a8071a',
                        borderColor: '#a8071a',
                        color: '#fff',
                        padding: '2rem 2.5rem',
                        boxShadow: '0 4px 10px rgba(168, 7, 26, 0.3)',
                        borderRadius: '999px',
                        fontSize: '1.5rem'
                    }}
                    onClick={() => onDeletePlace()}
                >
                    Delete
                </Button>
            </div>

            <UnapprovePlaceModal
                placeUserId={place?.userId}
                placeId={place?.id}
                setVisible={setIsUnapproveModalVisible}
                visible={isUnapproveModalVisible}
            />

            <DeletePlaceModal
                placeUserId={place?.userId}
                placeId={place?.id}
                setVisible={setIsDeleteModalVisible}
                visible={isDeleteModalVisible}
                isPlaceApproved={true}
            />

        </Card>
    );
};

export default ApprovedPlaceCard;