import React, { Component } from 'react';
import APIUtil from '../utils/API'
import { connect } from 'react-redux'
import { Route, Link, Redirect } from 'react-router-dom';
import { resetUser } from "../State/User"

interface IState {
    isLoaded: boolean
}

class LogoutPage extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoaded: false
        }
    }

    componentDidMount() {
        APIUtil.logout().then(() => {
            this.props.onResetUser()
            this.setState({ isLoaded: true })
        }).catch(err => {
            this.props.onResetUser()
            this.setState({ isLoaded: true })
        })
    }
    render() {
        if (this.state.isLoaded)
            document.location.href = "/dfd"
        return <div></div>
    }
}

const mapStateToProps = (state: any) => ({ User: state.UserReducer.User })
const mapDispatchToProps = (dispatch: any) => ({
    onResetUser: () => dispatch(resetUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage);