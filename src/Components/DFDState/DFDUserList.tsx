import React, { useContext, useEffect } from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import DFDUserElement from "./DFDUserElement"
import { User } from '../../State/User';

interface IProps {
    userlist: User[]
}

const DFDUserList: React.FC<IProps> = (props) => {
    if (props.userlist === null)
        return <div></div>
    const listItems = props.userlist.map((v: User) => <div key={v.id}><DFDUserElement profile_image={v.profile_image} username={v.username} state={v.state} state_created={v.state_created}></DFDUserElement> </div>)
    return (
        <div>
            {listItems}
        </div>
    );
}

export default DFDUserList;