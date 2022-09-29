import React, { useEffect, useContext, useState, useRef, useMemo, useCallback } from 'react';
import { Tooltip, Form, Modal, Input, message, notification, Switch } from 'antd';
import * as echarts from 'echarts';
import moment from 'moment';

interface Props {
    data: any,
    Xdata: any,
    onClick?: any,
}

let timer = null;
const BarCharts: React.FC<Props> = (props: any) => {
    const { data = [], Xdata = [], onClick } = props;
    useEffect(() => {
        const dom = document.getElementById('bar-chart');
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
                splitNumber: data.length === 1 ? 1 : 3,
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
                    // rotate: 45,
                    fontSize: 14,
                    // interval:99,
                    color: '#ddd',
                    fontFamily: 'Helvetica',
                    // formatter: function (val: any) {
                    //     return parseInt(val) ? moment(parseInt(val)).format(`YYYY-MM-DD HH:mm`) : val;
                    // }
                },
                data: Xdata,
            },
            series: [
                {
                    name: '正常',
                    id: 'normal',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
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
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data.map((item: any) => {
                        return item[1]
                    })
                },
            ]
        };
        myChart.setOption(option);

        myChart.on('click', (e) => {
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                onClick && onClick(e);
            }, 200);
        })
    }, [data, Xdata]);

    return (
        <div
            style={{ width: '100%', height: '100%' }}
            id="bar-chart"
        />
    );

};

export default BarCharts;