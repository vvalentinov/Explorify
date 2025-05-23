import { Card, Typography, Button } from 'antd';

import { CheckOutlined, UserOutlined } from '@ant-design/icons';

const UnapprovedPlaceCard = () => {
    return (
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
                    onClick={() => console.log('Approve logic here')}
                >
                    Approve
                </Button>
                <Button
                    danger
                    size="large"
                    icon={<UserOutlined />}
                    onClick={() => console.log('Reject logic here')}
                >
                    Reject
                </Button>
            </div>
        </Card>
    );
};

export default UnapprovedPlaceCard;