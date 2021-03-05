/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/react'

import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Row, Col, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap/';
import GameDataUtils from '../../utils/GameDataUtils'
import 'react-virtualized/styles.css';
import moment from 'moment';
interface IProps {
    win: boolean,
    members: string[],
    timestamp: string,
    queueid: string,
    gameid: string
}

class LOLGameElement extends Component<IProps>  {
    render() {
        let GameElementStyle = LossGameElementStyle;
        let winText = <div className="GameElementText ">패배</div>
        if (this.props.win) {
            winText = <div className="GameElementText ">승리</div>
            GameElementStyle = WinGameElementStyle;
        }
        const members = this.props.members.map(v => <Badge key={v} className="VerticalCenter" pill variant="secondary" css={MemeberTagStyle}>{v}</Badge>)
        const date = new Date(this.props.timestamp).toLocaleString("ko-KR")
        const ago = moment(this.props.timestamp).fromNow()

        const game = GameDataUtils.ConvertFromQueueID(this.props.queueid + "")
        const blitzTarget = this.props.members[Math.floor(Math.random() * this.props.members.length)]

        return (
            <Card css={GameElementStyle}>
                <Card.Body>
                    <Container >
                        <Row >
                            <Col className="VerticalCenter">
                                <Row>
                                    <Col lg={3} > <span className="GameElementText GameDateText " >
                                        <OverlayTrigger overlay={
                                            <Tooltip id={this.props.timestamp}>
                                                {date}
                                            </Tooltip>
                                        }>
                                            <div>{ago}</div>
                                        </OverlayTrigger>

                                    </span></Col>

                                    <Col className="GameElementText" lg={3} > {game}</Col>
                                    <Col lg={2} > {winText}</Col>
                                </Row>
                            </Col>
                            <Col className="VerticalCenter">
                                <Row>
                                    <Col lg={10}  > {members}</Col>
                                    <Col lg={2} > <Button size="sm" variant="link" onClick={() => {
                                        window.open("https://blitz.gg/lol/match/kr/" + blitzTarget + "/" + this.props.gameid, '_blank')
                                    }}>Blitz</Button></Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        );
    }
}

const MemeberTagStyle = css`
margin-left:5px;
margin-top: 5px;
`

const GameElementBaseStyle = css`
    height: 90%;
    border-style:solid;
    border-width:1.5px;
    margin-right:2px;
`

const WinGameElementStyle = css`
    ${GameElementBaseStyle};
    border-color:green;
    background-color: #7affa4;
`
const LossGameElementStyle = css`
    ${GameElementBaseStyle};
    border-color:red;
    background-color:#ff8f82;
`

export default React.memo(LOLGameElement);