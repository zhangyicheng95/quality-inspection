import React, { useEffect, } from 'react';
import * as echarts from 'echarts';
import moment from 'moment';
import * as _ from 'lodash';

interface Props {
    currentType?: any;
    data: any,
    Xdata: any,
    onXClick?: any,
    onClick?: any,
}

let timer = null;
const LineCharts: React.FC<Props> = (props: any) => {
    const { currentType, data = [], Xdata = [], onClick, onXClick } = props;

    useEffect(() => {
        const dom = document.getElementById('line-chart');
        const myChart = echarts.init(dom);
        const option = {
            color: ['rgb(115,171,216)', 'rgb(245,142,94)'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    // Use axis to trigger tooltip
                    type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                }
            },
            legend: {
                textStyle: {
                    color: '#ddd'
                    // fontFamily:'serif',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '5%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                fontSize: 14,
                splitNumber: 3,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#ddd',
                    },
                },
                axisLabel: {
                    color: '#ddd'
                    // fontFamily:'serif',
                },
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    show: true,
                    showMinLabel: true,
                    showMaxLabel: true,
                    clickable: true,
                    // rotate: 45,
                    fontSize: 14,
                    // interval:99,
                    color: '#ddd',
                    fontFamily: 'Helvetica',
                    // formatter: function (val: any) {
                    //     return parseInt(val) ? moment(parseInt(val)).format(`YYYY-MM-DD HH:mm`) : val;
                    // }
                },
                triggerEvent: true,
                data: Xdata,
            },
            series: [{
                name: '正常',
                id: 'normal',
                type: 'line',
                label: {
                    show: true,
                },
                emphasis: {
                    focus: 'series'
                },
                data: data.map((item: any) => {
                    return item[0]
                })
            },
            {
                name: '异常',
                id: 'abNormal',
                type: 'line',
                label: {
                    show: true,
                },
                emphasis: {
                    focus: 'series'
                },
                data: data.map((item: any) => {
                    return item[1]
                })
            }]
        };
        myChart.setOption(option);

        myChart.on('click', (e) => {
            if (e.componentType == 'xAxis') {
                timer && clearTimeout(timer);
                timer = setTimeout(() => {
                    onXClick && onXClick(e);
                }, 200);
            } else {
                timer && clearTimeout(timer);
                timer = setTimeout(() => {
                    onClick && onClick(e);
                }, 200);
            }
        });

        return () => {
            myChart && myChart.dispose();
        }

    }, [data, Xdata, currentType]);

    return (
        <div
            style={{ width: '100%', height: '100%' }}
            id="line-chart"
        />
    );

};

export default LineCharts;