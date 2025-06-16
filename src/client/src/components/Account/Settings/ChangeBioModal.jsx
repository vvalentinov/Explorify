import { useState, useContext, useEffect } from 'react';
import { Modal, Form, Input, App } from 'antd';

import { AuthContext } from '../../../contexts/AuthContext';
import { usersServiceFactory } from '../../../services/usersService';
import { fireError } from '../../../utils/fireError';

const { TextArea } = Input;

const ChangeBioModal = ({ visible, setVisible }) => {
    const { message } = App.useApp();
    const { token } = useContext(AuthContext);
    const usersService = usersServiceFactory(token);

    const [loading, setLoading] = useState(false);
    const [bio, setBio] = useState('');

    useEffect(() => {
        if (visible) {
            setLoading(true);
            usersService
                .getUserBio()
                .then(res => {
                    setBio(res.bio);
                })
                .catch(err => fireError(err))
                .finally(() => setLoading(false));
        } else {
            setBio('');
        }
    }, [visible]);

    const handleOk = () => {
        if (!bio || bio.length < 15 || bio.length > 350) {
            message.error('Bio must be between 15 and 350 characters.');
            return;
        }

        setLoading(true);
        usersService
            .changeBio({ Bio: bio })
            .then(res => {
                message.success(res.successMessage);
                setVisible(false);
            })
            .catch(err => fireError(err))
            .finally(() => setLoading(false));
    };

    const handleCancel = () => {
        setVisible(false);
        setBio('');
    };

    return (
        <Modal
            centered
            title={<span style={{ fontSize: '2rem' }}>Change Bio</span>}
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={loading}
            width={800}
            okText="Change"
            okButtonProps={{
                style: {
                    height: '48px',
                    fontSize: '1.5rem',
                    padding: '0 2rem',
                    fontWeight: 600,
                    backgroundColor: '#13c2c2'
                },
            }}
            cancelButtonProps={{
                style: {
                    height: '48px',
                    fontSize: '1.5rem',
                    padding: '0 2rem',
                    fontWeight: 600,
                },
                disabled: loading,
            }}
        >
            <Form layout="vertical">
                <Form.Item
                    label={<span style={{ fontSize: '1.5rem' }}>Bio</span>}
                    validateStatus={
                        bio?.length > 0 && (bio?.length < 15 || bio?.length > 350)
                            ? 'error'
                            : ''
                    }
                    help={
                        bio?.length > 0 && (bio?.length < 15 || bio?.length > 350)
                            ? 'Bio must be between 15 and 350 characters.'
                            : ''
                    }
                >
                    <TextArea
                        rows={4}
                        maxLength={350}
                        minLength={15}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="Enter your cool bio here..."
                        style={{ fontSize: '1.5rem' }}
                        disabled={loading}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangeBioModal;
