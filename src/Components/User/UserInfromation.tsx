import React, { useState } from 'react';
import { Card, Col, Form } from 'react-bootstrap/';
import '../../App.css'
import APIUtil from '../../utils/API'
import { useHistory } from "react-router-dom";
import ImageUtils from "../../utils/Image"
import configs from "../../config.json"
import { setUser, User } from "../../State/User"
import { useSelector, useDispatch } from 'react-redux';

interface IProps {
    edit: boolean
}

const UserInformation: React.FC<IProps> = (props) => {

    const dispatch = useDispatch()
    const User = useSelector((state: any) => state.UserReducer.User)
    const setUserState = (user: any) => dispatch(setUser(user));
    const CurrentUser: User = User.toJS()
    const history = useHistory()
    const [username, setUsername] = useState(CurrentUser.username);
    const [lol_name, setLoLname] = useState(CurrentUser.lol_name);

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        const formdata = new FormData(event.target)
        const json: { [name: string]: any } = {}
        formdata.forEach(function (value, prop) {
            json[prop] = value
        })
        let body: { [name: string]: any } = {}

        if (json["image"].size > 0) {
            if (ImageUtils.checkTypes(json["image"].type)) {
                const base64 = await ImageUtils.getBase64(json["image"])
                try {
                    const res = await APIUtil.post(configs.v1ApiBase + "/image", { "img": base64 })
                    body["profile_image_id"] = res["id"]
                } catch (e) {
                    alert("Image Upload Error")
                }

            } else {
                alert("Not supported file")
            }
        }
        if (body["profile_image_id"] !== undefined) {
            CurrentUser.profile_image = body["profile_image_id"]
        }
        if (json["username"] !== CurrentUser.username) {
            CurrentUser.username = json["username"]
            body["username"] = username;
        }

        if (body["username"] !== undefined || body["profile_image_id"] !== undefined) {
            APIUtil.patch(configs.v1ApiBase + `/user`, body).then(() => {
                setUserState(CurrentUser)
                history.replace("/user")
            }).catch(err => {
                alert("Something went wrong")
                console.log(err)
                history.replace("/user")
            })
        }
        if (json["lol_name"] !== CurrentUser.lol_name) {
            body = {}
            body["lol_username"] = lol_name
            APIUtil.patch(configs.v1ApiBase + `/user/lol`, body).then(() => {
                CurrentUser.lol_name = json["lol_name"]
                setUserState(CurrentUser)
                history.replace("/user")
            }).catch(err => {
                alert("Call admin to check access token")
                console.log(err)
                history.replace("/user")
            })
        }
    }

    if (props.edit) {
        return (
            <Form id="edit-form" onSubmit={handleSubmit}>
                <Col sm="10">
                    <Form.Group>
                        <Form.File name="image" id="profile image" label="profile image" />
                    </Form.Group>
                    <Form.Group controlId="username">
                        <Form.Label>
                            Username
                    </Form.Label>
                        <Form.Control name="username" type="text" placeholder="username" value={username} onChange={e => { setUsername(e.target.value) }} />
                    </Form.Group>
                    <Form.Group controlId="lol_name">
                        <Form.Label>
                            Lol Username
                    </Form.Label>
                        <Form.Control name="lol_name" type="text" placeholder="username" value={lol_name} onChange={e => { setLoLname(e.target.value) }} />
                    </Form.Group>
                </Col>
            </Form>
        )
    } else {

        let lolname = "You should set lol username"
        if (User.lol_name !== "") {
            lolname = User.get("lol_name")
        }
        return (
            <Card.Body>
                <Card.Title>{User.get("username")}</Card.Title>
                <img style={{ maxWidth: "50%" }} src={configs.v1ApiBase + "/image/" + User.get("profile_image")} alt="Profile Image not found"></img>
                <Card.Text><span style={{ fontWeight: "bold" }}>Email: </span>{User.get("email")}</Card.Text>
                <Card.Text><span style={{ fontWeight: "bold" }}>LOL Name: </span>{lolname}</Card.Text>
                <Card.Text> <span style={{ fontWeight: "bold" }}>Role: </span>{User.get("role")}</Card.Text>
                <Card.Text> <span style={{ fontWeight: "bold" }}>Registered: </span>{User.get("created")}</Card.Text>
            </Card.Body>
        )
    }

}
export default UserInformation