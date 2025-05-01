import { Card } from 'antd';

import { Link } from 'react-router-dom';

import slugify from 'slugify';

const PlacesList = ({ places }) => {
    return (
        <>
            {places.map(place => (
                <div key={place.id} style={{ display: 'inline-block', margin: '1rem' }}>
                    <Link
                        to={`/place/${slugify(place.name, { lower: true })}`}
                        state={{ placeId: place.id }}
                    >
                        <Card
                            // styles={{ body: { border: 'solid 1px black' } }}
                            hoverable
                            style={{ width: 240 }}
                            cover={<img alt="example" src={place.imageUrl} />}
                        >
                            <Card.Meta title={place.name} style={{ textAlign: 'center' }} />
                        </Card>
                    </Link>
                </div>
            ))}
        </>
    );
};

export default PlacesList;