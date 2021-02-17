import React, { useEffect, useRef } from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactApexChart from "react-apexcharts"
import ApexCharts from "apexcharts"
import { IChartData } from "../../utils/GameDataUtils"

import { List } from 'immutable'
interface IProps {
    ResultData: List<IChartData>
}

const LOLResultChart: React.FC<IProps> = (props: IProps) => {
    const chart = useRef(null)
    const options = {
        chart: {
            id: 'area-datetime',
            type: 'area',
            height: 350,
            zoom: {
                autoScaleYaxis: false
            }
        },
        title: {
            text: '승률'
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 1,
            style: 'hollow',
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false,
            },
            min: new Date('01 Jan 2021').getTime(),
            max: Date.now(),
            tickAmount: 6,
        },
        yaxis: {
            max: 100,
            min: 0
        },
        tooltip: {
            x: {
                format: 'yyyy/MM/dd'
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.8,
                opacityTo: 0.2,
                stops: [0, 100]
            }
        },

    }

    useEffect(() => {
        if (chart.current != null) {
            ApexCharts.exec('area-datetime', 'hideSeries', '일반');
            ApexCharts.exec('area-datetime', 'hideSeries', 'U.R.F');
            ApexCharts.exec('area-datetime', 'hideSeries', '칼바람');
        }
    });


    return (
        <ReactApexChart ref={chart} height="100%" options={options} series={props.ResultData.toJS()} type="area" />
    );
};

export default LOLResultChart;