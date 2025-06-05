import { App, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import styles from './OwnerPlaceButtonsSection.module.css';

const OwnerPlaceButtonsSection = ({ placeService, place }) => {
    const navigate = useNavigate();
    const { modal } = App.useApp();

    const handlePlaceDelete = () => {
        placeService
            .deletePlace(place?.id)
            .then(res => {
                navigate('/', { state: { successOperation: { message: res.successMessage } } })
            }).catch(err => {
                fireError(err);
            })
    }

    const confirm = () => {
        modal.confirm({
            title: 'Delete Place',
            className: 'custom-approve-modal',
            icon: null,
            content: (
                <Typography.Paragraph>
                    Are you sure you want to delete this place? <br />

                    <div>
                        <Typography.Text type="danger" strong>
                            This action will mark the place as deleted and remove it from public listings.
                        </Typography.Text>
                    </div>

                    <div>
                        <Typography.Text type="secondary" style={{ fontStyle: 'italic' }} strong>
                            You will have a time window in which to revert the deletion before it is permanently removed.
                        </Typography.Text>
                    </div>

                </Typography.Paragraph>
            ),
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => handlePlaceDelete()
        });
    };

    return (
        <div className={styles.buttonContainer}>
            <div className={styles.card}>
                <Typography.Title level={3} className={styles.cardTitle}>Want to make changes?</Typography.Title>
                <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => navigate(`/place/${place.slugifiedName}/edit`, { state: { placeId: place.id } })}
                >
                    <EditOutlined /> Edit This Place
                </button>
            </div>

            <div className={styles.card}>
                <Typography.Title level={3} className={styles.cardTitle}>No longer relevant?</Typography.Title>
                <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={confirm}
                >
                    <DeleteOutlined /> Delete This Place
                </button>
            </div>
        </div>
    );
};

export default OwnerPlaceButtonsSection;
