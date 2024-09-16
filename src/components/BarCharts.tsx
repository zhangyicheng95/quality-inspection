import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import { useModel } from 'umi';
import { message } from 'antd';
import _ from 'lodash';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}
const colorOption = [
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
  '#5470c6',
  '#91cc75',
  '#fac858',
];

var colorList = ['rgba(39,97,235,0.8)', 'rgba(56,200,234,0.8)'];
var colorList2 = ['rgba(36,222,112,0.9)', 'rgba(40,255,187,0.6)'];

const BarCharts: React.FC<Props> = (props: any) => {
  let myChart: any = null;
  const { data = {}, id } = props;
  let {
    dataValue = [],
    fontSize,
    yName,
    xName = '',
    direction,
    align,
    hiddenAxis,
    labelInxAxis,
    labelDirection,
    barRadius,
    showBackground,
    showWithLine,
    barColor = [],
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      { name: '上限', value: 2.2, color: 'red' },
      { name: '标准值', value: 1.6, color: 'green' },
      { name: '下限', value: 1.53, color: 'red' },
      { name: '上限1', value: 2.2, color: 'red' },
      { name: '标准值1', value: 1.6, color: 'green' },
      { name: '下限1', value: 1.53, color: 'red' },
      { name: '上限2', value: 2.2, color: 'red' },
      { name: '标准值2', value: 1.6, color: 'green' },
      { name: '下限2', value: 1.53, color: 'red' },
    ];
  }
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  barColor = [].concat(barColor);
  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('柱状图数据格式不正确，请检查');
      console.log('BarCharts:', dataValue);
      return;
    }
    let seriesData: any = [],
      markLineData: any = [],
      yData: any = [],
      minValue: any = 0,
      maxValue: any = 0,
      threshold_start,
      threshold_end,
      max = 0;
    dataValue.forEach((item: any) => {
      const { name, value, type } = item;
      if (value > max) {
        max = value;
      }
      if (type === 'markLine') {
        markLineData = markLineData.concat(item);
      } else if (type === 'start') {
        threshold_start = value;
      } else if (type === 'end') {
        threshold_end = value;
      } else {
        seriesData = seriesData.concat(item);
        yData = yData.concat(name);
      }
      if (_.isNull(minValue) || _.isNull(maxValue)) {
        minValue = value;
        maxValue = value;
        return;
      }
      if (value < minValue) {
        minValue = value;
      }
      if (value > maxValue) {
        maxValue = value;
      }
    });

    const dom: any = document.getElementById(`echart-${id}`);
    myChart = echarts.init(dom);
    const option = Object.assign({}, options, {
      legend: {
        show: false,
      },
      grid: Object.assign(
        options.grid,
        { top: '30px' },
        align === 'right'
          ? {
            left: `${xName?.length * (xName?.length < 4 ? 24 : 16)}px`,
            right: '3%',
          }
          : {
            right: `${xName?.length * (xName?.length < 4 ? 24 : 16)}px`,
          },
      ),
      yAxis: Object.assign(
        {},
        options.yAxis,
        {
          name: yName,
          boundaryGap: false,
          scale: true,
          min: threshold_start,
          max: threshold_end
        }
      ),
      xAxis: Object.assign(
        {},
        options.xAxis,
        {
          axisLabel: Object.assign(
            {},
            options.xAxis?.axisLabel,
            {
              formatter: function (val: any) {
                return val;
              },
            },
            labelInxAxis ? { inside: true, color: '#fff' } : {},
            { fontSize },
          ),
          type: 'category',
          splitLine: { show: false },
          splitNumber: 3,
          name: xName,
          scale: false,
          inverse: (align === 'right' && minValue >= 0) || (align === 'left' && minValue < 0),
        },
        hiddenAxis ? { show: false } : {},
      ),
      series: [
        {
          name: 'name',
          type: 'bar',
          label: {
            show: false,
            fontFamily: 'monospace',
            borderWidth: 0,
            position:
              direction === 'rows'
                ? labelDirection === 'top'
                  ? 'insideRight'
                  : labelDirection === 'bottom'
                    ? 'insideLeft'
                    : 'inside'
                : labelDirection === 'top'
                  ? 'top'
                  : labelDirection === 'bottom'
                    ? 'insideBottom'
                    : 'inside',
            formatter: (params: any) => params?.value?.toFixed?.(0) || params?.value,
            fontSize,
          },
          stack: 'total',
          showBackground: !!barRadius && !!showBackground,
          barMaxWidth: '50%',
          data: seriesData?.map?.((item: any, index: number) => {
            const { value, color } = item;
            if (params?.dataIndex >= colorList?.length) {
              index = params.dataIndex - colorList.length;
            }
            return {
              value: value,
              itemStyle: Object.assign(
                {},
                barColor.includes('default')
                  ? { color: color }
                  : barColor.includes('line1')
                    ? {
                      color: new echarts.graphic.LinearGradient(
                        direction === 'rows' ? 1 : 0,
                        direction === 'rows' ? 0 : 1,
                        0,
                        0,
                        [
                          {
                            offset: 0,
                            color: colorList[0],
                          },
                          {
                            offset: 1,
                            color: colorList[1],
                          },
                        ],
                      ),
                    }
                    : barColor.includes('line2')
                      ? {
                        color: new echarts.graphic.LinearGradient(
                          direction === 'rows' ? 1 : 0,
                          direction === 'rows' ? 0 : 1,
                          0,
                          0,
                          [
                            {
                              offset: 0,
                              color: colorList2[0],
                            },
                            {
                              offset: 1,
                              color: colorList2[1],
                            },
                          ],
                        ),
                      }
                      : { color: barColor[index % barColor?.length] },
                barRadius ? { borderRadius: [100, 100, 0, 0] } : {},
              ),
            };
          }),
          markLine: {
            data: markLineData?.map?.((mark: any, index: number) => {
              const { value, name, color } = mark;
              return Object.assign(
                {},
                {
                  name: name,
                  type: 'median',
                  lineStyle: {
                    width: 1,
                    color: color || colorOption[index],
                  },
                  label: {
                    show: true,
                    position: 'middle',
                    distance: 5,
                    color: color || colorOption[index],
                    formatter: `${name}：${value}`,
                  },
                },
                direction === 'rows' ? { xAxis: value } : { yAxis: value },
              );
            }),
            silent: false, // 鼠标悬停事件, true悬停不会出现实线
            symbol: 'none', // 去掉箭头
          },
          ...(barColor.includes('default') ? { colorBy: 'data' } : {}),
        },
        !barRadius && !!showBackground
          ? {
            type: 'bar',
            show: true,
            itemStyle: {
              normal: {
                label: {
                  show: labelDirection !== 'none',
                  position: direction === 'rows' ? 'insideRight' : 'insideTop',
                  formatter: '{b}',
                  padding: [0, 12, 0, 0],
                  fontSize: 14,
                },
                color: 'rgba(180, 180, 180, 0.2)',
              },
            },
            tooltip: { show: false },
            stack: 'total',
            data: seriesData?.map?.(() => max),
          }
          : null,
        showWithLine
          ? {
            name: 'name',
            type: 'line',
            tooltip: {
              show: false,
            },
            lineStyle: {
              ...(barColor.includes('line1')
                ? {
                  color: new echarts.graphic.LinearGradient(
                    direction === 'rows' ? 1 : 0,
                    direction === 'rows' ? 0 : 1,
                    0,
                    0,
                    [
                      {
                        offset: 0,
                        color: colorList[0],
                      },
                      {
                        offset: 1,
                        color: colorList[1],
                      },
                    ],
                  ),
                }
                : barColor.includes('line2')
                  ? {
                    color: new echarts.graphic.LinearGradient(
                      direction === 'rows' ? 1 : 0,
                      direction === 'rows' ? 0 : 1,
                      0,
                      0,
                      [
                        {
                          offset: 0,
                          color: colorList2[0],
                        },
                        {
                          offset: 1,
                          color: colorList2[1],
                        },
                      ],
                    ),
                  }
                  : {}),
            },
            data: seriesData?.map?.((item: any, index: number) => {
              const { value } = item;
              return value;
            }),
          }
          : null,
      ].filter(Boolean),
    });

    myChart.setOption(option);
    myChart.resize({
      width: dom.clientWidth,
      height: dom.clientHeight,
    });
    window.addEventListener(
      'resize',
      () => {
        myChart.resize({
          width: dom.clientWidth,
          height: dom.clientHeight,
        });
      },
      false,
    );

    return () => {
      window.removeEventListener(
        'resize',
        () => {
          myChart.resize({
            width: dom.clientWidth,
            height: dom.clientHeight,
          });
        },
        false,
      );
      myChart && myChart.dispose();
    };
  }, [data]);

  return (
    <div style={{ width: '100%', height: '100%' }} id={`echart-${id}`} />
  );
};

export default BarCharts;
