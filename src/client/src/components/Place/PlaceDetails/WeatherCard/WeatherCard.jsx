// import { Card, Typography, Space } from 'antd';

// import { CloudOutlined } from '@ant-design/icons';

// import styles from './WeatherCard.module.css';

// const WeatherCard = ({ data, isForAdmin }) => {

//     if (!data || !data.current || !data.location) {
//         return null;
//     }

//     const iconUrl = `https:${data.current?.condition?.icon}`;

//     return (
//         <Card
//             className={styles.weatherCard}
//             title={
//                 <Space>
//                     <CloudOutlined style={{ color: 'white', fontSize: '18px' }} />
//                     <Typography.Text style={{ color: 'white', fontWeight: 600 }}>
//                         {data.location.name}, {data.location.country}
//                     </Typography.Text>
//                 </Space>
//             }

//             style={{
//                 width: '100%',
//             }}
//             styles={{
//                 header: {
//                     background: isForAdmin
//                         ? 'linear-gradient(90deg, #1677ff 0%, #69c0ff 100%)'
//                         : 'linear-gradient(90deg, #52c41a 0%, #36cfc9 100%)',
//                 }
//             }}
//         >
//             <div className={styles.weatherContent}>
//                 <img src={iconUrl} alt={data.current?.condition?.text} />
//                 <Typography.Title level={3}>{data.current?.temp_c}°C</Typography.Title>
//                 <Typography.Text>{data.current?.condition?.text}</Typography.Text>

//                 <div className={styles.weatherMeta}>
//                     <Typography.Text>Humidity: {data.current?.humidity}%</Typography.Text>
//                     <Typography.Text>Pressure: {data.current?.pressure_mb} hPa</Typography.Text>
//                     <Typography.Text>Wind: {data.current?.wind_kph} kph</Typography.Text>
//                 </div>
//             </div>
//         </Card>
//     );
// };


// export default WeatherCard;

import { Typography } from 'antd';
import { CloudOutlined } from '@ant-design/icons';
import styles from './WeatherCard.module.css';

const { Title, Text } = Typography;

const WeatherCard = ({ data }) => {
    if (!data || !data.current || !data.location) {
        return null;
    }

    const iconUrl = `https:${data.current.condition.icon}`;

    return (
        <div className={styles.weatherCard}>
            <div className={styles.weatherHeader}>
                <CloudOutlined style={{ fontSize: '20px' }} />
                <Text className={styles.locationText}>
                    {data.location.name}, {data.location.country}
                </Text>
            </div>

            <div className={styles.weatherContent}>
                <img
                    src={iconUrl}
                    alt={data.current.condition.text}
                    className={styles.weatherIcon}
                />
                <Title level={3} className={styles.tempText}>
                    {data.current.temp_c}°C
                </Title>
                <Text className={styles.conditionText}>{data.current.condition.text}</Text>

                <div className={styles.weatherMeta}>
                    <Text>💧 Humidity: {data.current.humidity}%</Text>
                    <Text>🌬️ Wind: {data.current.wind_kph} kph</Text>
                    <Text>🧭 Pressure: {data.current.pressure_mb} hPa</Text>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;

