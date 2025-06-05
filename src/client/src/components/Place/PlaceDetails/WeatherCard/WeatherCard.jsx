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
                {/* <CloudOutlined style={{ fontSize: '40px' }} /> */}
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
                    <Text style={{ fontSize: '1.5rem' }}>💧 Humidity: {data.current.humidity}%</Text>
                    <Text style={{ fontSize: '1.5rem' }}>🌬️ Wind: {data.current.wind_kph} kph</Text>
                    <Text style={{ fontSize: '1.5rem' }}>🧭 Pressure: {data.current.pressure_mb} hPa</Text>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;

