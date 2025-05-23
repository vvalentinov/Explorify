import { Typography } from 'antd';
import { CheckOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const PlaceStatusPill = ({ place }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem'
        }}>
            <div
                style={{
                    backgroundColor: '#89ADFF',
                    borderRadius: '999px',
                    padding: '0.5rem 1.5rem',
                    display: 'inline-block',
                    margin: '0 auto',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
            >
                <Typography.Title
                    level={3}
                    style={{
                        margin: 0,
                        color: '#1f1e2f',
                    }}
                >
                    {/* {place?.isApproved && (
                        <span>
                            <CheckOutlined style={{ color: 'green', marginRight: '5px' }} />
                            Approved Place
                        </span>
                    )}

                    {!place?.isApproved && (
                        <span>
                            <ExclamationCircleOutlined style={{ color: 'yellow', marginRight: '5px' }} />
                            Unapproved Place
                        </span>
                    )}

                    {place?.isDeleted && (
                        <span>
                            <DeleteOutlined style={{ color: 'red', marginRight: '5px' }} />
                            Deleted Place
                        </span>
                    )} */}

                    {place?.isDeleted ? (
                        <span>
                            <DeleteOutlined style={{ color: 'red', marginRight: '5px' }} />
                            Deleted Place
                        </span>
                    ) : place?.isApproved ? (
                        <span>
                            <CheckOutlined style={{ color: 'green', marginRight: '5px' }} />
                            Approved Place
                        </span>
                    ) : (
                        <span>
                            <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: '5px' }} />
                            Unapproved Place
                        </span>
                    )}


                </Typography.Title>
            </div>
        </div>
    )
};

export default PlaceStatusPill;