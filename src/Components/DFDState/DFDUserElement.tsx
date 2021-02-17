import React from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Row, Col } from 'react-bootstrap/';
import configs from "../../config.json"

interface IProps {
    username: string,
    profile_image: string,
    state: string,
    state_created: string
}

const DFDUserElement: React.FC<IProps> = (props: IProps) => {
    const date = new Date(props.state_created)

    var date_string = ""
    if (date.getFullYear() > 2000) {
        date_string = date.toLocaleString("ko-KR")
    }

    return (
        <Card style={{ marginTop: "5px" }}>
            <Card.Body>
                <Container >
                    <Row >
                        <Col md={6}>
                            <Row>
                                <Col xs={6} > <img style={{ height: "30px" }} src={configs.v1ApiBase + "/image/" + props.profile_image}></img></Col>
                                <Col xs={6} > {props.username}</Col>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <Row>
                                <Col xs={6} > {props.state}</Col>
                                <Col xs={6}> {date_string}</Col>
                            </Row>
                        </Col>


                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}

export default React.memo(DFDUserElement);