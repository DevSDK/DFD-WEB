import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, NavDropdown, Container, Row, Col, Button, Badge, Card } from 'react-bootstrap/';
const AboutPage: React.FC = () => {
    var list = ["GoLang", "Gin-Gonic", "Redis", "JWT", "Kubernetes", "Docker", "OAuth2", "GridFS", "Swagger", "React"]
    var stacks = list.map((e) => <Badge key={e} style={{ marginRight: "5px" }} pill variant="primary">{e}</Badge>)
    return (
        <Container>
            <Row>
                <Col style={{ margin: "auto" }} >
                    <Card body style={{ marginTop: "20px" }}>
                        <h3>
                            About
                    </h3>
                        <br />
                        <div>
                            DFD는 League of legends파티 "롤팟"을 위한 게임 전적 및 통계를 보여주는 서비스입니다.
                    </div>
                        <div>
                            팀 맴버 3인 이상이 참여한 게임을 집계합니다.
                    </div>
                        <div>
                            파티원이 오늘 게임이 있는지 여부를 한눈에 볼 수 있는 기능도 제공합니다.
                    </div>
                        <div>
                            처음 로그인 하면 Guest그룹에 속하게 됩니다. 관리자에게 User 권한을 요청하세요. 로그인이 필요한 서비스는 대부분 User 그룹에서 엑세스 할 수 있습니다.
                    </div>
                        <br />
                        <span>기술 스택: {stacks} </span>
                        <br />
                        <Button variant="link" href={"https://github.com/DevSDK/DFD"}>Git Repository</Button>
                        <Button variant="link" href={"https://devsdk.net/api/dfd/docs/index.html"}>API Document</Button>

                    </Card>
                </Col>
            </Row>

        </Container>
    );
};

export default AboutPage;