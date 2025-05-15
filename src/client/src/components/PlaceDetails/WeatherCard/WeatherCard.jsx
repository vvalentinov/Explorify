import { Card, Typography, Space } from 'antd';

import styles from './WeatherCard.module.css';

const WeatherCard = ({ data }) => {
    if (!data || !data.current || !data.location) {
        return null;
    }

    const iconUrl = `https:${data.current?.condition?.icon}`;

    return (
        <Card
            className={styles.weatherCard}
            title={
                <Space>
                    <Typography.Text strong>{data.location.name}, {data.location.country}</Typography.Text>
                </Space>
            }
            style={{
                width: '100%'
            }}
        >
            <div className={styles.weatherContent}>
                <img src={iconUrl} alt={data.current?.condition?.text} />
                <Typography.Title level={3}>{data.current?.temp_c}°C</Typography.Title>
                <Typography.Text>{data.current?.condition?.text}</Typography.Text>

                <div className={styles.weatherMeta}>
                    <Typography.Text>Humidity: {data.current?.humidity}%</Typography.Text>
                    <Typography.Text>Pressure: {data.current?.pressure_mb} hPa</Typography.Text>
                    <Typography.Text>Wind: {data.current?.wind_kph} kph</Typography.Text>
                </div>
            </div>
        </Card>
    );
};


export default WeatherCard;
