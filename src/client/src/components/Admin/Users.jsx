import { Table, Avatar, Button, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

// More dummy users to trigger pagination
const users = [
    {
        id: 1,
        username: 'john_doe',
        email: 'john@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
        id: 2,
        username: 'jane_smith',
        email: 'jane@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
        id: 3,
        username: 'admin_user',
        email: 'admin@explorify.com',
        avatar: null,
    },
    {
        id: 4,
        username: 'alex_jones',
        email: 'alex@example.com',
        avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
        id: 5,
        username: 'emily_wu',
        email: 'emily@example.com',
        avatar: 'https://i.pravatar.cc/150?img=4',
    },
    {
        id: 6,
        username: 'michael_chen',
        email: 'michael@example.com',
        avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
        id: 7,
        username: 'nina_patel',
        email: 'nina@example.com',
        avatar: 'https://i.pravatar.cc/150?img=6',
    },
    {
        id: 8,
        username: 'will_khan',
        email: 'will@example.com',
        avatar: 'https://i.pravatar.cc/150?img=7',
    },
    {
        id: 9,
        username: 'chloe_davis',
        email: 'chloe@example.com',
        avatar: 'https://i.pravatar.cc/150?img=8',
    },
    {
        id: 10,
        username: 'luke_taylor',
        email: 'luke@example.com',
        avatar: 'https://i.pravatar.cc/150?img=9',
    },
    {
        id: 11,
        username: 'sofia_roberts',
        email: 'sofia@example.com',
        avatar: 'https://i.pravatar.cc/150?img=10',
    },
    {
        id: 12,
        username: 'noah_martin',
        email: 'noah@example.com',
        avatar: 'https://i.pravatar.cc/150?img=11',
    },
];

const AdminUsers = () => {
    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (avatar) =>
                avatar ? (
                    <Avatar src={avatar} size="large" />
                ) : (
                    <Avatar icon={<UserOutlined />} size="large" />
                ),
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => <span style={{ color: '#888' }}>{email}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button variant='solid' icon={<EditOutlined />} size="large">
                        Edit
                    </Button>
                    <Button variant='solid' icon={<DeleteOutlined />} size="large">
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <Title level={2}>Manage Users 👥</Title>

            <div style={{ marginTop: '2rem' }}>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    bordered
                    style={{
                        background: '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}
                />
            </div>
        </div>
    );
};

export default AdminUsers;
