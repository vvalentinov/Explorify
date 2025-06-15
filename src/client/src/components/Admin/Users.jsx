import { Table, Avatar, Button, Space, Typography, message } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { adminServiceFactory } from '../../services/adminService';

import styles from './Users.module.css';

const { Title } = Typography;

const AdminUsers = () => {

    const { token } = useContext(AuthContext);

    const adminService = adminServiceFactory(token);

    const [users, setUsers] = useState([]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6,
        total: 0,
    });

    const [loading, setLoading] = useState(false);

    const fetchUsers = async (page = 1) => {

        try {
            setLoading(true);

            const result = await adminService.getUsers(page);

            setUsers(result.users);

            setPagination((prev) => ({
                ...prev,
                current: result.pagination.pageNumber,
                total: result.pagination.recordsCount,
            }));

        } catch (err) {
            message.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(pagination.current); }, [pagination.current]);

    const handlePageChange = (page) => { setPagination((prev) => ({ ...prev, current: page })); };

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'profileImageUrl',
            key: 'avatar',
            render: (avatar) =>
                avatar ? (
                    <Avatar size={60} src={avatar} />
                ) : (
                    <Avatar size={60} icon={<UserOutlined />} />
                ),
        },
        {
            title: 'Username',
            dataIndex: 'userName',
            key: 'username',
            render: (text) => <span style={{ fontSize: '1.1rem' }}>{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => <span style={{ fontSize: '1.1rem' }}>{email}</span>,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <span style={{ fontSize: '1.1rem' }}>{role}</span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.role !== 'Administrator' && (
                        <Button
                            variant='solid'
                            color='danger'
                            icon={<EditOutlined />}
                            onClick={() => handleMakeAdmin(record.id)}
                            style={{ fontSize: '1.1rem', padding: '20px 20px' }}
                        >
                            Make Admin
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const handleMakeAdmin = async (userId) => {
        try {
            await adminService.makeUserAdmin(userId);
            message.success('User promoted to admin');
            fetchUsers(pagination.current);
        } catch (err) {
            message.error('Failed to promote user');
        }
    };

    return (
        <div className={styles.tableContainer}>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: handlePageChange,
                }}
                bordered
                className={styles.table}
            />

        </div>
    );
};

export default AdminUsers;
