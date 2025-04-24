import styles from './ImageOverlayContainer.module.css';

import { Image } from 'antd';

const ImageOverlayContainer = ({ imageUrl, text }) => {
    return (
        <div className={styles.container}>
            <Image
                preview={false}
                src={imageUrl}
                alt={text}
                style={{ height: '100%' }}
            />
            <div className={styles.overlay}>
                <div className={styles.text}>{text}</div>
            </div>
        </div>
    )
};

export default ImageOverlayContainer;