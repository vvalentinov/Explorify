import styles from './Spinner.module.css';

import { LoadingOutlined } from '@ant-design/icons';

import { Spin } from 'antd';

const Spinner = () => {
    return (
        <div className={styles.spinnerContainer}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 70, color: '#13c2c2' }} spin />} />
        </div>
    )
};

export default Spinner;