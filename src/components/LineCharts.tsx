import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import * as _ from 'lodash';
import { message } from 'antd';
import moment from 'moment';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const LineCharts: React.FC<Props> = (props: any) => {
  let myChart: any = null;
  const { data = {}, id, } = props;
  let { dataValue = [], yName, xName = '', timeSelector } = data;
  if (process.env.NODE_ENV === 'development') {
    let base = new Date().getTime();
    let time = [];
    for (let i = 1; i < 120; i++) {
      time.push(moment(new Date(base + (i + 1) * 3600000)).format('YYYY-MM-DD HH:mm:ss'))
    }
    let data1: any = [[moment(base).format('YYYY-MM-DD HH:mm:ss'), Math.random() * 300]],
      data2: any = [[moment(base).format('YYYY-MM-DD HH:mm:ss'), Math.random() * 100]];
    for (let i = 1; i < 120; i++) {
      let now = new Date((base += 1000 * i));
      data1.push([
        time[i],
        Math.round(Math.random() * 20 + data1[i - 1][1]),
      ]);
    }
    for (let i = 1; i < 120; i++) {
      let now = new Date((base += 1000 * i));
      data2.push([
        time[i],
        Math.round(Math.random() * 20 + data2[i - 1][1]),
      ]);
    }

    dataValue = [
      {
        name: 'data1',
        color: 'red',
        value: data1,
      },
      {
        name: "data2",
        color: 'green',
        value: data2
      }
    ];
  };

  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('趋势图数据格式不正确，请检查');
      console.log('LineCharts', dataValue);
      return;
    }

    const dom: any = document.getElementById(`echart-${id}`);
    myChart = echarts.init(dom);
    let minValue: any = null,
      maxValue: any = null;
    let maxLength = 0;
    (dataValue || []).forEach((item: any, index: number) => {
      const { value, type } = item;
      if (type === 'markLine') {
        return;
      } else {
        if (_.isArray(value)) {
          (value || []).forEach((val: any) => {
            if (val[0] > maxLength) {
              maxLength = val[0];
            }
          });
          if (_.isNull(minValue) || _.isNull(maxValue)) {
            minValue = value[0][0];
            maxValue = value[value.length - 1][0];
            return;
          }
          if (value[0][0] < minValue) {
            minValue = value[0][0];
          }
          if (value[0][0] > maxValue) {
            maxValue = value[0][0];
          }
        }
      }
    });

    const option = Object.assign({}, options, {
      // tooltip: false,
      legend: Object.assign(
        {},
        options.legend,
        {
          left: 'center',
          itemWidth: 16,
          itemHeight: 8,
          textStyle: {
            ...options.legend?.textStyle,
            fontSize: 14,
          },
        }
      ),
      grid: Object.assign({}, options.grid, {
        right: `${xName?.length * (xName?.length < 4 ? 24 : 16)}px`,
        bottom: 30,
      }),
      yAxis: Object.assign({}, options.yAxis, {
        type: 'value',
        name: yName,
        boundaryGap: false,
        scale: true,
        axisLine: {
          show: false
        }
      }),
      xAxis: Object.assign({}, options.xAxis, {
        type: 'category',
        name: xName,
        boundaryGap: [0, 0],
        min: minValue + '',
        max: maxValue + '',
        scale: true,
        axisLabel: {
          ...options.xAxis.axisLabel,
          formatter: function (val: any) {
            return val?.split(' ').join(`\n`);
          },
        },
        axisLine: {
          show: true
        }
      }),
      series: (dataValue || [])?.map?.((item: any) => {
        const { name, value, type, color } = item;
        if (type === 'markLine') {
          return {
            name: name,
            type: 'line',
            symbolSize: 0,
            label: {
              show: false,
            },
            animation: false,
            emphasis: {
              focus: 'series',
            },
            markLine: {
              data: [
                {
                  name: name,
                  yAxis: value,
                  type: 'median',
                },
              ],
              lineStyle: {
                width: 1,
                // color: '#3FBF00',
              },
              label: {
                show: true,
                position: 'middle',
                distance: 5,
                formatter: `${name}：${value}`,
              },
              silent: false, // 鼠标悬停事件, true悬停不会出现实线
              symbol: 'none', // 去掉箭头
            },
            data: [[minValue, value]],
          };
        } else {
          return {
            name: name,
            type: 'line',
            symbolSize: 2,
            smooth: true, // 是否平滑曲线
            label: {
              show: false,
            },
            color,
            sampling: 'lttb',
            animation: false,
            emphasis: {
              focus: 'series',
            },
            data: value, //.filter((i: any) => !!i[1])
          };
        }
      }),
    }, timeSelector ? {
      brush: {
        id: '1',                                      // 组件ID
        toolbox: ['rect', 'clear'],// toolbox 中的按钮 rect 矩形，polygon 任意形状等。
        xAxisIndex: 0,
      }
    } : {});
    myChart.on('brushEnd', function (params) {
      const res = dataValue?.filter((i: any) => i.type !== 'markLine');
      const range = params?.areas?.[0]?.coordRange?.[0];
      const startT = res?.[0]?.value?.[range[0]]?.[0];
      const endT = res?.[0]?.value?.[range[1]]?.[0];
      const start = new Date(startT).getTime(),
        end = new Date(endT).getTime();
      console.log('框选的范围:', startT, endT);
      console.log(start, end);
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

  useEffect(() => {
    if (!!myChart && timeSelector) {
      // 必须等echarts渲染完了，才能添加默认状态
      myChart.dispatchAction({
        type: 'takeGlobalCursor',
        // 如果想变为“可刷选状态”，必须设置。不设置则会关闭“可刷选状态”。
        key: 'brush',
        brushOption: {
          // 参见 brush 组件的 brushType。如果设置为 false 则关闭“可刷选状态”。
          brushType: 'rect',
          // 参见 brush 组件的 brushMode。如果不设置，则取 brush 组件的 brushMode 设置。
          brushMode: 'single'
        }
      });
    }
  }, [myChart, timeSelector]);

  return (
    <div style={{ width: '100%', height: '100%' }} id={`echart-${id}`} />
  );
};

export default LineCharts;
