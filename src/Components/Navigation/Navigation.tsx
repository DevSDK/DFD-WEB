import React from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Spinner } from 'react-bootstrap/';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import configs from "../../config.json"
const NavigationUser: React.FC = () => {
    const User = useSelector((state: any) => state.UserReducer.User)
    const UserLoaded = useSelector((state: any) => state.UserReducer.isUserLoaded)

    if (Object.entries(User.toJS()).length > 0) {
        var UserNav = <Spinner animation="grow" />
        if (UserLoaded)
            UserNav = <Nav>
                <Nav.Link as={Link} to="/user"><img src={configs.v1ApiBase + "/image/" + User.get("profile_image")}
                    style={{ marginRight: "5px", height: "25px" }}></img>{User.get("username")}</Nav.Link>
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
    var LoginNav = <Spinner animation="grow" />
    if (UserLoaded) {
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

export default NavigationUser;