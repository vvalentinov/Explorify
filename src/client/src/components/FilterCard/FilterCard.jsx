import styles from './FilterCard.module.css';

import { ConfigProvider, Card, Typography, Radio } from "antd";

const options = [
    { label: 'Approved', value: 'Approved' },
    { label: 'Unapproved', value: 'Unapproved' },
    { label: 'Recently Deleted', value: 'Deleted' },
];

const FilterCard = ({
    isForAdmin,
    handleFilterChange,
    defaultValue,
    value
}) => {
    return (
        <Card className={isForAdmin ? styles.filterCardAdmin : styles.filterCard}>

            <ConfigProvider
                theme={{
                    components: {
                        Radio: {
                            borderRadius: 12,
                            colorPrimary: isForAdmin ? '#1890ff' : '#9c4dcc',
                            buttonBg: isForAdmin ? '#cce4ff' : '#e6d4f5',
                            buttonColor: isForAdmin ? '#0958d9' : '#6a2c91',
                            buttonSolidCheckedBg: isForAdmin ? '#1890ff' : '#9c4dcc',
                            buttonSolidCheckedColor: 'white',
                            buttonSolidCheckedHoverBg: isForAdmin ? '#1677ff' : '#8a3dac',
                            buttonSolidCheckedActiveBg: isForAdmin ? '#1890ff' : '#9c4dcc',
                        },
                    },
                }}
            >

                <Radio.Group
                    options={options}
                    defaultValue={defaultValue}
                    optionType="button"
                    value={value}
                    buttonStyle="solid"
                    size="large"
                    className={styles.radioGroup}
                    onChange={handleFilterChange}
                    name='Sort'
                />
            </ConfigProvider>

        </Card>
    );
};

export default FilterCard;