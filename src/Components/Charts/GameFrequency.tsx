import React from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactApexChart from "react-apexcharts"
import { IHeatMapData } from "../../utils/GameDataUtils"
import { List } from 'immutable'
interface IProps {
    HeatmapData: List<IHeatMapData>
}

const LOLFrequencyChart: React.FC<IProps> = (props: IProps) => {
    const HeatMapOption = {
        chart: {
            type: 'heatmap',
            toolbar: { show: false, autoSelected: '' }
        },
        dataLabels: {
            enabled: false
        },
        colors: ["#008FFB"],
        title: {
            text: 'Game Frequency'
        },
        responsive: [{
            breakpoint: undefined,
            options: {
                width: "100%"
            }
        }],
        plotOptions: {
            heatmap: {
                colorScale: {
                    ranges: [{
                        from: 0,
                        to: 0,
                        name: 'N/A',
                        color: '#888888'
                    },
                    {
                        from: 1,
                        to: 5,
                        name: '1 ~ 5',
                        color: '#008FFB'
                    },
                    {
                        from: 6,
                        to: 20,
                        name: '5<',
                        color: '#FF1111'
                    },
                    ],
                }
            }
        }
    }
    return (
        <ReactApexChart height="100%" options={HeatMapOption} series={props.HeatmapData.toJS()} type="heatmap" />
    );
};

export default LOLFrequencyChart;