import React, { Component } from 'react';

import { Route, Link } from 'react-router-dom';
import './App.css';
import { Navbar } from 'react-bootstrap/';
import NavigationUser from './Components/Navigation/Navigation'

import AboutPage from "./Pages/About"
import MainPage from "./Pages/Main"
import DFDStatePage from "./Pages/DFDState"
import UserPage from "./Pages/User"

import LoginPage from "./Pages/Login"
import LogoutPage from "./Pages/Logout"

class App extends Component {


    componentDidUpdate() {

    }
    componentDidMount() {
    }
    render() {
        

        return (

            <div className="App">
                <Navbar collapseOnSelect expand="sm" bg="primary" variant="dark">
                    <Navbar.Brand as={Link} to="/">DFD</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <NavigationUser></NavigationUser>
                </Navbar>
                <Route path="/" exact={true} component={MainPage} />
                <Route path="/auth" component={LoginPage} />
                <Route path="/status" component={DFDStatePage} />
                <Route path="/logout" component={LogoutPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/user" component={UserPage} />
            </div>
        );
    }
}

export default App;
