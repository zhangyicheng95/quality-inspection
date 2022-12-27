import React, { useEffect, } from 'react';
import * as echarts from 'echarts';
import * as _ from 'lodash';

interface Props {
    currentType?: any;
    data: any,
    title?: any,
}

const BarCharts: React.FC<Props> = (props: any) => {
    const { data = [], title, currentType } = props;
    useEffect(() => {
        const dom = document.getElementById('pie-chart');
        const myChart = echarts.init(dom);
        const option = {
            title: {
                show: !!title,
                text: title,
                textStyle: {
                    color: '#ddd'
                    // fontFamily:'serif',
                },
            },
            // color: ['rgb(115,171,216)', 'rgb(245,142,94)'],
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
                left: '0%',
                right: '4%',
                bottom: '5%',
                containLabel: true
            },
            series: [
                {
                    name: '统计',
                    type: 'pie',
                    label: {
                        show: true,
                        position: 'inside',
                        fontSize: 16,
                        formatter: `{b}: {c} ({d}%)`,
                    },
                    data: data
                },
            ]
        };

        myChart.setOption(Object.assign({}, option, currentType !== 'defect' ? {
            color: ['rgb(115,171,216)', 'rgb(245,142,94)'],
        } : {}));

        return () => {
            myChart && myChart.dispose();
        }

    }, [data, title, currentType]);

    return (
        <div
            style={{ width: '100%', height: '100%' }}
            id="pie-chart"
        />
    );

};

export default BarCharts;