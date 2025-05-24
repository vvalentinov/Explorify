import { Card, Typography, Button, App } from 'antd';

import { CheckOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { AuthContext } from '../../../../contexts/AuthContext';

import { useContext, useState } from 'react';

import { adminServiceFactory } from '../../../../services/adminService';

import { fireError } from '../../../../utils/fireError';

import { useNavigate } from 'react-router-dom';

import DeletePlaceModal from '../Modals/DeletePlaceModal';

const UnapprovedPlaceCard = ({ place }) => {

    const navigate = useNavigate();

    const { token } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const { modal } = App.useApp();

    const onDeletePlaceClick = () => setIsDeleteModalVisible(true);

    const approvePlaceModal = () => {
        modal.confirm({
            title: 'Approve Place',
            icon: <ExclamationCircleOutlined />,
            content: (
                <p>
                    Are you sure you want to approve this place? <br />
                    <Typography.Text type="danger" strong>
                        This action will mark the place as approved and the place will be visible on the site.
                        The user will gain points and receive notification.
                    </Typography.Text>
                </p>
            ),
            okText: 'Approve',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => onApprovePlace()
        });
    };

    const onApprovePlace = () => {
        adminService
            .approvePlace(place?.id)
            .then(res => {
                navigate('/admin', { state: { successOperation: { message: res.successMessage } } })
            }).catch(err => {
                fireError(err);
            });
    }

    return (
        <>
            <Card
                style={{
                    margin: '2rem 3rem',
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    textAlign: 'center',
                    padding: '2rem',
                }}
            >
                <Typography.Title level={3} style={{ color: '#389e0d', marginBottom: '1rem' }}>
                    Approve This Place?
                </Typography.Title>
                <Typography.Paragraph style={{ fontSize: '16px', color: '#4b5563', marginBottom: '2rem' }}>
                    This place looks great! If everything checks out, go ahead and approve it for the community.
                </Typography.Paragraph>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <Button
                        type="primary"
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        size="large"
                        icon={<CheckOutlined />}
                        onClick={() => approvePlaceModal()}
                    >
                        Approve
                    </Button>
                    <Button
                        danger
                        size="large"
                        icon={<UserOutlined />}
                        onClick={() => onDeletePlaceClick()}
                    >
                        Reject
                    </Button>
                </div>
            </Card>

            <DeletePlaceModal
                isPlaceApproved={false}
                placeId={place?.id}
                setVisible={setIsDeleteModalVisible}
                visible={isDeleteModalVisible}
            />
        </>

    );
};

export default UnapprovedPlaceCard;