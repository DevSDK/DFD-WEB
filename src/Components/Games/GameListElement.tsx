import React, { Component } from 'react';
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
        let GameBorder = "red"
        let Background = "#ff8f82"
        let winText = <div className="GameElementText ">패배</div>
        if (this.props.win) {
            GameBorder = "#green"
            Background = "#7affa4"
            winText = <div className="GameElementText ">승리</div>
        }
        const members = this.props.members.map(v => <Badge key={v} className="VerticalCenter" pill variant="secondary" style={{ marginLeft: "5px", marginTop: "5px" }}>{v}</Badge>)
        const date = new Date(this.props.timestamp).toLocaleString("ko-KR")
        const ago = moment(this.props.timestamp).fromNow()

        const game = GameDataUtils.ConvertFromQueueID(this.props.queueid + "")
        const blitzTarget = this.props.members[Math.floor(Math.random() * this.props.members.length)]

        return (
            <Card style={{ backgroundColor: Background, borderColor: GameBorder, height: "90%", borderStyle: "solid", borderWidth: "1.5px", marginRight: "2px" }}  >
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

export default React.memo(LOLGameElement);