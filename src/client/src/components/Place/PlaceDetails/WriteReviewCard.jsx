import { Card, Typography, Button } from 'antd';

const WriteReviewCard = ({ handleOpenModal }) => {
    return (
        <Card
            style={{
                background: '#e8fffb',
                border: '1px solid green',
                borderRadius: '12px',
                textAlign: 'center',
                margin: '0 10rem',
                padding: 0,
            }}
        >

            <Typography.Title level={4}>What did you think of this place?</Typography.Title>
            <Typography.Paragraph>
                Share your experience and help others explore with confidence!
            </Typography.Paragraph>

            <Button
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