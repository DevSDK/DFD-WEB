import React, { Component } from 'react';
import '../../App.css'
import { Card, Col, Container, Button, Row } from 'react-bootstrap/';

import DFDButton from "./DFDButton"

import DFDUserList from "./DFDUserList"
import APIUtil from '../../utils/API';
import Chart from "react-apexcharts"

import { connect } from 'react-redux';

import configs from '../../config.json'
import { setUser, User } from '../../State/User';

interface IProps {
    User: any,
    setUserState: any
}

interface IState {
    current: { [name: string]: boolean },
    statics: number[],
    userlist: User[],
}

class DFDPageComponent extends Component<IProps, IState> {

    interval?: NodeJS.Timeout

    constructor(props: any) {
        super(props)
        this.state = { current: { "롤": false, "OK": false, "야": false, "탈": false, "블": false }, statics: [], userlist: [] }
    }

    async getUserList(arr: []) {
        const userlist = []
        const counts = [0, 0, 0, 0]
        for (const user of arr) {
            const result = await APIUtil.get(configs.v1ApiBase + `/user/` + user)
            userlist.push(result["user"])
            const v = result["user"]
            if (v.state.search("없") > 0)
                continue
            if (v.state.search("롤") > 0)
                counts[0]++;
            if (v.state.search("야") > 0)
                counts[1]++;
            if (v.state.search("탈") > 0)
                counts[2]++
            if (v.state.search("블") > 0)
                counts[3]++
        }
        this.setState({ statics: counts })
        this.setState({ userlist: userlist })
    }


    async updateList() {
        if (this.context !== null) {
            const users = await APIUtil.get(configs.v1ApiBase + `/userlist`)
            this.getUserList(users["user"])
        }
    }
    postServer() {
        let cur = ""
        if (this.state.current["롤"])
            cur += "롤"
        if (this.state.current["야"])
            cur += "야"
        if (this.state.current["탈"])
            cur += "탈"
        if (this.state.current["블"])
            cur += "블"
        let postFix = "없"
        if (this.state.current["OK"]) {
            postFix = "있"
        }
        const stateString = "오" + cur + postFix
        const currentUser = this.props.User.toJS()
        currentUser.state = stateString
        APIUtil.post(configs.v1ApiBase + "/state", { state: stateString }).then(
            () => {
                this.props.setUserState(currentUser)
            }
        )
    }

    componentDidMount() {
        const UserStatus = this.props.User.get("state");
        if (UserStatus[0] === "오") {
            const status = this.state.current
            if (UserStatus.search("롤") > 0)
                status["롤"] = true
            if (UserStatus.search("야") > 0)
                status["야"] = true
            if (UserStatus.search("탈") > 0)
                status["탈"] = true
            if (UserStatus.search("블") > 0)
                status["블"] = true
            if (UserStatus.search("있") > 0)
                status["OK"] = true

            this.setState({ current: status })
        }
        this.updateList()
        this.interval = setInterval(() => {
            this.updateList()
        }, 2000);
    }


    componentWillUnmount() {
        if (this.interval != undefined)
            clearInterval(this.interval);
    }


    onClickDFDButton(id: string) {
        const modified = this.state.current
        if (id === "OK") {
            modified["OK"] = true
        } else if (id === "NO") {
            modified["OK"] = false
        } else {
            modified[id] = !modified[id]
        }
        this.setState({ current: modified })
        this.postServer()
    }

    render() {
        let chart = (<div></div>)
        const options = {
            chart: {
                type: 'pie',
            },
            labels: ["롤", "야", "탈", "블"],
            responsive: [{
                breakpoint: undefined,
                options: {
                    width: "100%"
                }
            }]
        };

        if (this.state.statics !== null) {
            chart = (<Chart
                height="100%"
                options={options}
                series={this.state.statics}
                type="pie"
            />)
        }

        return (
            <div>
                <Container >
                    <Row style={{ marginTop: "25px" }}>
                        <Col sm={6}>
                            <Card className="Status-Height">
                                <Card.Body>
                                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "50px" }}>오</div>
                                    <div style={{ textAlign: "center" }}>
                                        <DFDButton toggle={this.state.current["롤"]} onClick={() => { this.onClickDFDButton("롤") }} text="롤"></DFDButton>
                                        <DFDButton toggle={this.state.current["야"]} onClick={() => { this.onClickDFDButton("야") }} text="야"></DFDButton>
                                        <DFDButton toggle={this.state.current["탈"]} onClick={() => { this.onClickDFDButton("탈") }} text="탈"></DFDButton>
                                        <DFDButton toggle={this.state.current["블"]} onClick={() => { this.onClickDFDButton("블") }} text="블"></DFDButton>
                                    </div>

                                    <div style={{ textAlign: "center" }}>
                                        <DFDButton toggle={this.state.current["OK"]} onClick={() => { this.onClickDFDButton("OK") }} text="있"></DFDButton>
                                        <DFDButton toggle={!this.state.current["OK"]} onClick={() => { this.onClickDFDButton("NO") }} text="없"></DFDButton>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={6}><Card className="Status-Height" >
                            <Card.Body>
                                {chart}
                            </Card.Body>
                        </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "25px" }}>
                        <Col sm={12}>
                            <Card className="Users">
                                <Card.Body style={{ overflowY: "scroll" }}>
                                    <DFDUserList userlist={this.state.userlist}></DFDUserList>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                </Container>
            </div>
        );
    }
}


const mapStateToProps = (state: any) => ({
    User: state.UserReducer.User,
});

const mapDispatchToProps = (dispatch: any) => ({
    setUserState: (user: any) => dispatch(setUser(user))
})



export default connect(mapStateToProps, mapDispatchToProps)(DFDPageComponent)