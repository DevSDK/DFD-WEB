import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import DFDPageComponent from "../Components/DFDState/DFDPage"
import withUser from '../Components/HOCS/withUser';

const DFDPage: React.FC<any> = (props) => {
    if (props.user.get("role") === "guest") {
        return <div>You may need request your role update to admin</div>
    }
    return (
        <DFDPageComponent></DFDPageComponent>
    );
};

export default withUser(DFDPage);