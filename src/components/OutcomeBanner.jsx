import React from 'react';
import { Alert } from 'reactstrap';

export default props => {
    const { requestSuccess } = props;
    return (
        <div>
            {
                requestSuccess !== null && requestSuccess &&
                    <Alert color="success">
                        Operation was successful
                    </Alert>
            }
            {
                requestSuccess !== null && !requestSuccess &&
                    <Alert color="danger">
                        Operation couldn't be performed
                    </Alert>
            }
        </div>
    )
}
