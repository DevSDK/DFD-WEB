import React, { Component } from 'react';
import APIUtil from '../utils/API'

interface IState {
    isLoaded: boolean
}

class LoginPage extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoaded: false
        }
    }

    componentDidMount() {
        APIUtil.get_token().then((data) => {
            localStorage.setItem("access", data.access)
            localStorage.setItem("refresh", data.refresh)
            this.setState({ isLoaded: true })
        }).catch((error) => {
            this.setState({ isLoaded: true })
        })
    }
    render() {
        if (this.state.isLoaded)
            document.location.href = "/dfd"
        return <div></div>
    }
}


export default LoginPage;