import { Card } from 'antd';

const PlacesList = ({ places }) => {
    return (
        <>
            {places.map(place => (
                <Card
                    key={place.id}
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={place.imageUrl} />}
                >
                    <Card.Meta title={place.name} />
                </Card>
            ))}
        </>
    );
};

export default PlacesList;