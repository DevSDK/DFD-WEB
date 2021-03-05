import React, { useContext } from 'react';
import UserInformation from "../Components/User/UserInfromation"
import { RouteProps } from "react-router";
import withUser from "../Components/HOCS/withUser"
import { Card, Col, Container, Button } from 'react-bootstrap/';
import { useHistory } from "react-router-dom";

import qs from 'qs'
import '../App.css'

interface IProps {
    user : any,
    location: RouteProps["location"]
}
const UserPage: React.FC<IProps> = ({ location, user }) => {
    let edit = false;
    if (location != undefined) {
        const query = qs.parse(location.search, { ignoreQueryPrefix: true })
        edit = query.edit === 'true';
    }
    const history = useHistory()
    function editClick() {
        history.replace('/user?edit=true')
    }

    function cancelClick() {
        history.replace('/user')
    }

    let EditButton = <Button className="float-right" onClick={editClick}>Edit</Button>
    if (edit) {
        EditButton = <div>
            <Button className="float-right" variant="danger" onClick={cancelClick}>Cancel</Button>
            <Button className="float-right" variant="success" style={{ marginRight: "10px" }} form="edit-form" type="submit">Save</Button>
        </div>
    }
    if (Object.entries(user.toJS()).length > 0) {
        return (
            <div className="Margin-Top">
                <Container>
                    <Col xs="auto">
                        <Card >
                            <Card.Header> {EditButton}</Card.Header>
                            <UserInformation edit={edit}></UserInformation>
                        </Card>
                    </Col>
                </Container>
            </div>
        )
    } else {
        return (
            <div>
                You should login
            </div>
        );
    }

}



export default withUser(UserPage);
