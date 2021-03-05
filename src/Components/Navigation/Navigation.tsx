import React from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Spinner } from 'react-bootstrap/';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import configs from "../../config.json"
import withUser from '../HOCS/withUser';
const NavigationUser: React.FC<any> = (props) => {
    if (props.user != null) {
        let UserNav = <Spinner animation="grow" />
        if (props.IsUserLoaded)
            UserNav = <Nav>
                <Nav.Link as={Link} to="/user"><img src={configs.v1ApiBase + "/image/" + props.user.get("profile_image")}
                    style={{ marginRight: "5px", height: "25px" }}></img>{props.user.get("username")}</Nav.Link>
                <Nav.Link href="/dfd/logout">Logout</Nav.Link>
            </Nav>

        return (
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/status">오롤?</Nav.Link>
                    <Nav.Link as={Link} to="/about">About</Nav.Link>
                </Nav>
                {UserNav}
            </Navbar.Collapse>
        )
    }
    let LoginNav = <Spinner animation="grow" />
    if (props.IsUserLoaded) {
        LoginNav = <Nav>
            <Nav.Link href={configs.authApiBase + "/login"}>Login</Nav.Link>
        </Nav>
    }
    return (
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link as={Link} to="/about">About</Nav.Link>
            </Nav>
            {LoginNav}
        </Navbar.Collapse>

    );
};

export default withUser(NavigationUser, true);