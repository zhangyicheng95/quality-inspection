import React, { useEffect, useContext, useState, useRef, useMemo, useCallback } from 'react';
import { Tooltip, Form, Modal, Input, message, notification, Switch } from 'antd';
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
const BarCharts: React.FC<Props> = (props: any) => {
    const { currentType, data = [], Xdata = [], onClick, onXClick } = props;

    useEffect(() => {
        const dom = document.getElementById('bar-chart');
        const myChart = echarts.init(dom);
        const option = {
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
        };

        myChart.setOption(Object.assign({}, option, currentType !== 'defect' ? {
            color: ['rgb(115,171,216)', 'rgb(245,142,94)'],
            series: [{
                name: '正常',
                id: 'normal',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true,
                    formatter: (params) => {
                        const { data } = params;
                        const { value, total } = data;
                        return `${value}\n(${(value / total * 100).toFixed(2).toString().replace(/^(.*\..{2}).*$/, "$1")}%)`
                    }
                },
                emphasis: {
                    focus: 'series'
                },
                data: data.map((item: any) => {
                    return { value: item[0], total: (item[0] || 0) + (item[1] || 0) }
                })
            },
            {
                name: '异常',
                id: 'abNormal',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true,
                    formatter: (params) => {
                        const { data } = params;
                        const { value, total } = data;
                        return `${value}\n(${(value / total * 100).toFixed(2).toString().replace(/^(.*\..{2}).*$/, "$1")}%)`
                    }
                },
                emphasis: {
                    focus: 'series'
                },
                data: data.map((item: any) => {
                    return { value: item[1], total: (item[0] || 0) + (item[1] || 0) }
                })
            }],
        } : {
            series: [
                {
                    name: '缺陷',
                    id: 'abNormal',
                    type: 'bar',
                    label: {
                        show: true,
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    backgroundStyle: {
                        color: 'rgb(245,142,94)',
                    },
                    data: data
                }
            ]
        }));

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
            id="bar-chart"
        />
    );

};

export default BarCharts;