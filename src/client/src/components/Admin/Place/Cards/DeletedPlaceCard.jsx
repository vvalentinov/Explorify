import { Card, Typography, Button } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

const DeletedPlaceCard = () => {

    return (
        <Card
            style={{
                margin: '2rem 3rem',
                backgroundColor: '#fff1f0',
                border: '1px solid #ffa39e',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                textAlign: 'center',
                padding: '2rem',
            }}
        >
            <Typography.Title level={3} style={{ color: '#cf1322', marginBottom: '1rem' }}>
                This is the deleted place card
            </Typography.Title>
            <Typography.Paragraph style={{ fontSize: '16px', color: '#4b5563', marginBottom: '2rem' }}>
                This place has been marked as deleted. You can revert the deletion if it was a mistake.
            </Typography.Paragraph>

            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap' }}>
                <Button
                    type="default"
                    icon={<RollbackOutlined />}
                    size="large"
                    style={{
                        borderColor: '#389e0d',
                        color: '#389e0d',
                        padding: '0 2rem',
                        boxShadow: '0 4px 10px rgba(56, 158, 13, 0.2)',
                        borderRadius: '999px',
                    }}
                    onClick={() => console.log('Revert logic here')}
                >
                    Revert Deletion
                </Button>
            </div>
        </Card>
    );
};

export default DeletedPlaceCard;
