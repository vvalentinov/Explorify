import { Card, Typography, Button } from 'antd';

const WriteReviewCard = ({ handleOpenModal }) => {
    return (
        <Card
            style={{
                background: '#e8fffb',
                border: '1px solid green',
                borderRadius: '20px',
                textAlign: 'center',
                padding: 0,
                marginBottom: '4rem',
                width: '100%'
            }}
        >

            <Typography.Title style={{ fontSize: '2rem' }} level={4}>What did you think of this place?</Typography.Title>
            <Typography.Paragraph style={{ fontSize: '1.4rem' }}>
                Share your experience and help others explore with confidence!
            </Typography.Paragraph>

            <Button
                style={{ fontSize: '1.7rem', padding: '2.5rem 2rem', borderRadius: '20px' }}
                color='cyan'
                variant='solid'
                size='large'
                onClick={handleOpenModal}>
                Write a Review
            </Button>

        </Card>
    )
};

export default WriteReviewCard;