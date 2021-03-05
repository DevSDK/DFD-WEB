/** @jsx jsx */
import React, { Component, CSSProperties, ReactNode } from 'react';
import { css, jsx } from '@emotion/react'

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
    async processData(data: any): Promise<void> {
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

    async requestAndSetState(): Promise<void> {
        APIUtil.get(configs.v1ApiBase + "/lol/histories").then(gamedata => {
            this.setState({ gamelist: this.state.gamelist.concat(gamedata["games"]) })
        })
        APIUtil.get(configs.v1ApiBase + "/lol/datelogs").then(data => {
            this.processData(data)
        })
    }

    componentDidMount(): void {
        this.requestAndSetState()
    }

    render(): ReactNode {
        let heatmap = <Spinner css={CenterStyle} animation="grow" />
        let GameList = <Spinner css={CenterStyle} animation="grow" />
        let ResultChart = <Spinner css={CenterStyle} animation="grow" />

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
                elements.push(<span key={key} css={WinRatiosPerModesTextStyle}>&nbsp;
                {GameDataUtils.ConvertFromQueueID(key)} : {value.win}W {value.count - value.win}L {value.count}G({percent}%) </span>)
            }
            const TotalWinWinraito = Math.floor((total_win / total) * 100)
            TotalWinRatoElement = <h5 css={TotalRaitoTextStyle}>Total: {total_win}W {total - total_win}L {total}G({TotalWinWinraito}%)</h5>
            ElementPerGames = <div> {elements} </div>
        }

        return (
            <Container >
                <Row css={RowStyle}>
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
                <Row css={RowStyle}>
                    <Col sm={12}>
                        <Card css={WinRaitosCardStyle}>
                            <Card.Body css={AlignCenterStyle}>
                                <div>
                                    {TotalWinRatoElement}
                                    <div>
                                        {ElementPerGames}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row css={RowStyle}>
                    <Col sm={12}>
                        <Card >
                            <Card.Body css={GameResultListStyle}>
                                {GameList}
                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </Container>
        )
    }
}
const CenterStyle = css`
    position: absolute;
    top: 47%;
    left: 47%;
    translate: translate(-50%, -50%);
`
const AlignCenterStyle = css`
    margin:auto;
    text-align: center;
`

const WinRaitosCardStyle = css`
    margin-bottom: -10px;
    margin-height: 75px;
`

const WinRatiosPerModesTextStyle = css`
    color:grey;
    font-size:12px;
`

const TotalRaitoTextStyle = css`
    text-align:center;
    margin-top:-5px;
`
const RowStyle = css`
    margin-top : 25px;
`

const GameResultListStyle = css`
    height:450px;
`
export default MainPage;