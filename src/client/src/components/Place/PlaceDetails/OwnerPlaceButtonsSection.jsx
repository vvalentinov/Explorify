// import { App, Typography } from "antd";

// import { useNavigate } from "react-router-dom";

// const OwnerPlaceButtonsSection = ({ placeService, place }) => {

//     const navigate = useNavigate();

//     const { modal } = App.useApp();

//     const handlePlaceDelete = () => {
//         placeService
//             .deletePlace(place?.id)
//             .then(res => {
//                 navigate('/', { state: { successOperation: { message: res.successMessage } } })
//             }).catch(err => {
//                 fireError(err);
//             })
//     }

//     const confirm = () => {
//         modal.confirm({
//             title: 'Delete Place',
//             icon: <ExclamationCircleOutlined />,
//             content: (
//                 <p>
//                     Are you sure you want to delete this place? <br />
//                     <Typography.Text type="danger" strong>
//                         This action will mark the place as deleted. You will have a time window in which to revert the deletion before it is permanently removed.
//                     </Typography.Text>
//                 </p>
//             ),
//             okText: 'Delete',
//             okType: 'danger',
//             cancelText: 'Cancel',
//             onOk: () => handlePlaceDelete()
//         });
//     };

//     return (
//         <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             gap: '2rem',
//             margin: '2rem 3rem',
//             flexWrap: 'wrap',
//         }}>
//             <div style={{
//                 flex: 1,
//                 minWidth: 250,
//                 backgroundColor: '#f6ffed',
//                 padding: '1.5rem',
//                 borderRadius: '16px',
//                 boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
//                 textAlign: 'center',
//             }}>
//                 <h3 style={{ color: '#13c2c2', marginBottom: '1rem' }}>Want to make changes?</h3>
//                 <button
//                     onClick={() => navigate(`/place/${place.slugifiedName}/edit`, { state: { placeId: place.id } })}
//                     style={{
//                         backgroundColor: '#13c2c2',
//                         border: 'none',
//                         color: 'white',
//                         padding: '0.6rem 1.2rem',
//                         borderRadius: '8px',
//                         fontSize: '1rem',
//                         cursor: 'pointer',
//                         transition: 'background 0.3s ease'
//                     }}
//                 >
//                     Edit This Place
//                 </button>
//             </div>

//             <div style={{
//                 flex: 1,
//                 minWidth: 250,
//                 backgroundColor: '#fff1f0',
//                 padding: '1.5rem',
//                 borderRadius: '16px',
//                 boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
//                 textAlign: 'center',
//             }}>
//                 <h3 style={{ color: '#cf1322', marginBottom: '1rem' }}>No longer relevant?</h3>
//                 <button
//                     onClick={() => confirm()}
//                     style={{
//                         backgroundColor: '#cf1322',
//                         border: 'none',
//                         color: 'white',
//                         padding: '0.6rem 1.2rem',
//                         borderRadius: '8px',
//                         fontSize: '1rem',
//                         cursor: 'pointer',
//                         transition: 'background 0.3s ease'
//                     }}
//                 >
//                     Delete This Place
//                 </button>
//             </div>
//         </div>
//     )

// };

// export default OwnerPlaceButtonsSection;

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
            icon: <ExclamationCircleOutlined />,
            content: (
                <p>
                    Are you sure you want to delete this place? <br />
                    <Typography.Text type="danger" strong>
                        This action will mark the place as deleted. You will have a time window in which to revert the deletion before it is permanently removed.
                    </Typography.Text>
                </p>
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
                <h3 className={styles.cardTitle}>Want to make changes?</h3>
                <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => navigate(`/place/${place.slugifiedName}/edit`, { state: { placeId: place.id } })}
                >
                    <EditOutlined /> Edit This Place
                </button>
            </div>

            <div className={styles.card}>
                <h3 className={styles.cardTitle}>No longer relevant?</h3>
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
