import React, { Component, CSSProperties, ReactNode } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Container, Row, Col, Card } from 'react-bootstrap/';
import GameDataUtils, { IGame, IHeatMapData, IChartData, ICountAndWin } from "../utils/GameDataUtils"

import APIUtil from '../utils/API';
import LOLGameList from '../Components/Games/GameList'
import LOLFrequencyChart from '../Components/Charts/GameFrequency'
import LOLResultChart from '../Components/Charts/GameResultChart'

import { Map, List } from 'immutable'
import configs from '../config.json';

interface IState {
    gamelist: List<IGame>,
    HeatmapData: List<IHeatMapData>,
    ResultChartData: List<IChartData>
    TotalGameCountData: Map<string, ICountAndWin>
}

class MainPage extends Component<any, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            gamelist: List(),
            HeatmapData: List(),
            ResultChartData: List(),
            TotalGameCountData: Map()
        }
    }
    async processData(data: any) : Promise<void>  {
        (async () => {
            //FIXME: Hrad Coded year
            const HeatMap = GameDataUtils.GetFrequencyArray(data["data"])
            this.setState({ HeatmapData: this.state.HeatmapData.concat(HeatMap[2021]) })
        })();
        (async () => {
            const WinRaitoData = GameDataUtils.GetDailyWinRaitoMap(data["data"])
            this.setState({ ResultChartData: this.state.ResultChartData.concat(WinRaitoData) })
        })();
        (async () => {
            const WinCountMapData = GameDataUtils.GetTotalMapWithQueueID(data["data"])
            this.setState({ TotalGameCountData: this.state.TotalGameCountData.concat(WinCountMapData) })
        })();
    }

    async requestAndSetState() : Promise<void> {
        APIUtil.get(configs.v1ApiBase + "/lol/histories").then(gamedata => {
            this.setState({ gamelist: this.state.gamelist.concat(gamedata["games"]) })
        })
        APIUtil.get(configs.v1ApiBase + "/lol/datelogs").then(data => {
            this.processData(data)
        })
    }

    componentDidMount() : void{
        this.requestAndSetState()
    }

    render() : ReactNode {
        const centerStyle: CSSProperties = { position: "absolute", top: "47%", left: "47%", translate: "translate(-50%, -50%)" }
        let heatmap = <Spinner style={centerStyle} animation="grow" />
        let GameList = <Spinner style={centerStyle} animation="grow" />
        let ResultChart = <Spinner style={centerStyle} animation="grow" />

        if (this.state.HeatmapData.size > 0)
            heatmap = <LOLFrequencyChart HeatmapData={this.state.HeatmapData}></LOLFrequencyChart>

        if (this.state.gamelist.size > 0) {
            GameList = <LOLGameList gamelist={this.state.gamelist} />
        }

        if (this.state.ResultChartData.size > 0) {
            ResultChart = <LOLResultChart ResultData={this.state.ResultChartData}></LOLResultChart>
        }

        let TotalWinRatoElement = <Spinner animation="border" />
        let ElementPerGames = <div></div>
        if (Object.keys(this.state.TotalGameCountData.toJS()).length > 0) {
            let total = 0;
            let total_win = 0;
            const elements = []
            for (const [key, value] of Object.entries(this.state.TotalGameCountData.toJS())) {
                total += value.count
                total_win += value.win
                const percent = Math.floor((value.win / value.count) * 100)
                elements.push(<span key={key} style={{ color: "grey", fontSize: "12px" }}>&nbsp;
                {GameDataUtils.ConvertFromQueueID(key)} : {value.win}W {value.count - value.win}L {value.count}G({percent}%) </span>)
            }
            const TotalWinWinraito = Math.floor((total_win / total) * 100)
            TotalWinRatoElement = <h5 style={{ textAlign: "center", marginTop: "-5px" }}>Total: {total_win}W {total - total_win}L {total}G({TotalWinWinraito}%)</h5>
            ElementPerGames = <div> {elements} </div>
        }

        return (
            <Container >
                <Row style={{ marginTop: "25px" }}>
                    <Col sm={6}>
                        <Card className="ChartCard">
                            <Card.Body>
                                {heatmap}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={6}><Card className="ChartCard">
                        <Card.Body>
                            {ResultChart}
                        </Card.Body>
                    </Card>
                    </Col>
                </Row>
                <Row style={{ marginTop: "25px" }}>
                    <Col sm={12}><Card style={{ minHeight: "75px", marginBottom: "-10px" }}>
                        <Card.Body style={{ margin: "auto" }}>

                            <div style={{ margin: "auto", textAlign: "center" }}>
                                {TotalWinRatoElement}
                                <div style={{ margin: "auto", textAlign: "center" }}>
                                    {ElementPerGames}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    </Col>
                </Row>

                <Row style={{ marginTop: "25px" }}>
                    <Col sm={12}>
                        <Card >
                            <Card.Body style={{ height: "450px" }}>
                                {GameList}
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </Container>
        )
    }
}
export default MainPage;