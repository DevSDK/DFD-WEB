import React, { useContext } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DFDPageComponent from "../Components/DFDState/DFDPage"

import { useSelector } from 'react-redux';

const DFDPage = () => {

    const User = useSelector((state: any) => state.UserReducer.User)

    if (Object.entries(User.toJS()).length == 0) {
        return (<div>You should login</div>)
    }

    if (User.get("role") === "guest") {
        return <div>You may need request your role update to admin</div>
    }
    return (
        <DFDPageComponent></DFDPageComponent>
    );
};

export default DFDPage;