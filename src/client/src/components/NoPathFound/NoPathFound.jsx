import { Button, Result } from 'antd';

import { Link } from 'react-router-dom';

import { homePath } from '../../constants/paths';

const NoPathFound = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Link to={homePath}>
                    <Button
                        color='cyan'
                        variant='solid'
                        size='large'>
                        Back Home
                    </Button>
                </Link>
            }
        />
    )
};

export default NoPathFound;