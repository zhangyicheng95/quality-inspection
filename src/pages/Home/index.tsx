import React, { useState } from "react";
import { Progress } from "antd";
import * as _ from "lodash";
import styles from "./index.module.less";
import moment from "moment";
import gongjianIcon from '@/assets/imgs/gongjian.png';
import clickItemBg from '@/assets/imgs/click-bg.png';
import clickItemBg2 from '@/assets/imgs/click-bg-2.png';
import kuangshiImg from '@/assets/imgs/OIP-C.jpeg'
import LineCharts from "@/components/LineCharts";
import BarCharts from "@/components/BarCharts";
import ThreeCharts from "@/components/Three/ThreeCharts";

const controlStatus = {
  '0': '离线',
  '1': '在线',
};
const errorStatus = {
  '0': '待处理',
  '1': '处理中',
  '2': '已处理',
  '3': '超时',
};
const errorColor = {
  '0': '#5BE9FF',
  '1': '#1890FF',
  '2': '#3BD92D',
  '3': '#FF7B00',
};

const Home: React.FC<any> = (props) => {
  const [controlList, setControlList] = useState([
    {
      name: '工区A-C1通道',
      img: gongjianIcon,
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: new Date().getTime(),
      errorNum: 10,
      faultRate: 58,
      onLine: 88,
    },
    {
      name: '工区A-C2通道',
      img: gongjianIcon,
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: new Date().getTime(),
      errorNum: 10,
      faultRate: 98,
      onLine: 98,
    },
    {
      name: '工区A-C3通道',
      img: gongjianIcon,
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: new Date().getTime(),
      errorNum: 10,
      faultRate: 98,
      onLine: 98,
    },
    {
      name: '工区A-C4通道',
      img: gongjianIcon,
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: new Date().getTime(),
      errorNum: 10,
      faultRate: 98,
      onLine: 98,
    },
    {
      name: '工区A-C5通道',
      img: gongjianIcon,
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: new Date().getTime(),
      errorNum: 10,
      faultRate: 98,
      onLine: 98,
    },
    {
      name: '工区A-C6通道',
      img: gongjianIcon,
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: new Date().getTime(),
      errorNum: 10,
      faultRate: 98,
      onLine: 98,
    }
  ]);
  const [deviceData, setDeviceData] = useState([
    {
      key: 'total',
      name: '设备总数',
      number: 1000,
    },
    {
      key: 'onLine',
      name: '在线设备数',
      number: 900,
    },
    {
      key: 'offLine',
      name: '离线设备数',
      number: 100,
    },
    {
      key: 'error',
      name: '报警设备数',
      number: 3,
    }
  ]);
  const [centerBottomData, setCenterBottomData] = useState([
    {
      key: 'total',
      name: '设备总数',
      number: 1000,
    },
    {
      key: 'onLine',
      name: '在线设备数',
      number: 900,
    },
    {
      key: 'offLine',
      name: '离线设备数',
      number: 100,
    },
    {
      key: 'error',
      name: '报警设备数',
      number: 3,
    },
    {
      key: 'total1',
      name: '设备总数',
      number: 1000,
    },
    {
      key: 'onLine1',
      name: '在线设备数',
      number: 900,
    },
    {
      key: 'offLine1',
      name: '离线设备数',
      number: 100,
    },
    {
      key: 'error1',
      name: '报警设备数',
      number: 3,
    }
  ]);
  const [centerSelected, setCenterSelected] = useState<any>({});
  const [errorList, setErrorList] = useState([
    {
      id: '1',
      errors: '告警',
      info: 'C4-1A通道压力值存在波动',
      img: kuangshiImg,
      status: '0',
    },
    {
      id: '12',
      errors: '告警',
      info: 'C4-1A通道压力值存在波动',
      img: kuangshiImg,
      status: '1',
    },
    {
      id: '13',
      errors: '告警',
      info: 'C4-1A通道压力值存在波动',
      img: kuangshiImg,
      status: '2',
    },
    {
      id: '14',
      errors: '异常',
      info: 'C4-1A通道振动值存在严重异常',
      img: kuangshiImg,
      status: '0',
    },
    {
      id: '15',
      errors: '异常',
      info: 'C4-1A通道振动值存在严重异常',
      img: kuangshiImg,
      status: '3',
    },
    {
      id: '16',
      errors: '异常',
      info: 'C4-1A通道振动值存在严重异常',
      img: kuangshiImg,
      status: '2',
    },
  ]);
  const conlumn = [
    {
      key: 'errors',
      title: '异常分类',
      width: '20%'
    },
    {
      key: 'info',
      title: '报警信息',
      width: '40%'
    },
    {
      key: 'img',
      title: '异常图片',
      width: '20%',
      render: (text) => {
        return <a href={text} target="_blank">查看图片</a>
      }
    },
    {
      key: 'status',
      title: '处理状态',
      width: '20%',
      render: (text) => {
        return <div style={{ color: errorColor[text] }}>{errorStatus[text]}</div>
      }
    }
  ]

  return (
    <div className={`${styles.home} flex-box`} onClick={() => { setCenterSelected({}); }}>
      <div className="home-left">
        <div className="flex-box home-header">
          <div className="rect" /> 设备状态列表
        </div>
        <div className="home-box">
          {
            (controlList || [])?.map((item: any, index: number) => {
              const {
                name,
                img,
                identifier,
                status,
                onLineTime,
                syncTime,
                errorNum,
                faultRate,
                onLine,
              } = item;

              return <div className="home-box-item-box" key={`home-box-item-box-${index}`}>
                <div className="flex-box-justify-between home-item-three-header">
                  <div className="home-item-three-header-left">{name}</div>
                  <div className="home-item-three-header-right">{`设备编号: ${identifier}`}</div>
                </div>
                <div className="flex-box home-item-three-body">
                  <div className="flex-box-center home-item-three-body-left">
                    <img src={gongjianIcon} alt="" />
                  </div>
                  <div className="flex-box-column home-item-three-body-right">
                    <div className="flex-box-justify-between home-item-three-body-right-item">
                      <div>设备状态</div> {controlStatus[status]}
                    </div>
                    <div className="flex-box-justify-between home-item-three-body-right-item">
                      <div>在线时长</div> {onLineTime}
                    </div>
                    <div className="flex-box-justify-between home-item-three-body-right-item">
                      <div>同步时间</div> {moment(syncTime || new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                    <div className="flex-box-justify-between home-item-three-body-right-item">
                      <div>报警次数</div> {errorNum}
                    </div>
                    <div className="flex-box home-item-three-body-right-progress">
                      <div className="home-item-three-body-right-progress-item">
                        <Progress
                          strokeColor={{
                            '0%': '#2bd8ff',
                            '100%': '#1B7FF0',
                          }} percent={faultRate} format={(percent) => <div><div>在线</div>{percent}%</div>} />
                      </div>
                      <div className="home-item-three-body-right-progress-item">
                        <Progress
                          strokeColor={{
                            '0%': '#2bd8ff',
                            '100%': '#1B7FF0',
                          }} percent={onLine} format={(percent) => <div><div>在线</div>{percent}%</div>} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </div>
      <div className="home-center">
        <div className="flex-box-center home-center-top">
          {
            (deviceData || [])?.map((item: any, index: number) => {
              const { key, name, number } = item;
              return <div className="flex-box home-center-item-box" key={key}>
                <div className="flex-box-center home-center-item-box-content">
                  {name}
                  <div className="home-center-item-box-content-number">{number}</div>
                </div>
                {
                  (index + 1) < deviceData?.length ?
                    <div className="split-line" style={{ height: '70%' }} />
                    : null
                }
              </div>
            })
          }
        </div>
        <div className="flex-box-column home-center-center">
          {[6, 6, 6, 6].map((len: number, i: number) => {
            return <div className="flex-box home-center-center-item-box" key={`home-center-center-item-box-${i}`}>
              {
                Array.from({ length: len })?.map((item: any, index: number) => {
                  return <div
                    className="home-center-center-item-box-td"
                    key={`home-center-center-item-box-td-${index}`}
                    style={{ left: `${index * 18}%` }}
                    onClick={(e) => {
                      setCenterSelected({ index: [i, index], position: { x: e.clientX, y: e.clientY } });
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  ></div>
                })
              }
            </div>
          })}
        </div>
        <div className="flex-box-center home-center-bottom">
          {
            (centerBottomData || [])?.map((item: any, index: number) => {
              const { key, name, number } = item;
              return <div className="flex-box home-center-item-box" key={key}>
                <div className="flex-box-center home-center-item-box-content">
                  {name}
                  <div className="home-center-item-box-content-number">{number}</div>
                </div>
                {
                  (index + 1) < centerBottomData?.length ?
                    <div className="split-line" style={{ height: '70%' }} />
                    : null
                }
              </div>
            })
          }
        </div>
      </div>
      <div className="home-right">
        <div className="flex-box home-header">
          <div className="rect" /> 统计
        </div>
        <div className="flex-box-column home-box">
          <div className="home-box-item-box">
            <div className="flex-box-justify-between home-item-three-header">
              <div className="home-item-three-header-left">报警统计</div>
            </div>
            <div className="home-item-three-body">
              <div className="basic-table">
                <div className="flex-box basic-table-header">
                  {
                    (conlumn || [])?.map((item: any, index: number) => {
                      const { key, title, width } = item;
                      return <div
                        key={key}
                        className="basic-table-header-td"
                        style={{ width }}
                      >{title}</div>
                    })
                  }
                </div>
                <div className="basic-table-body">
                  {
                    (errorList || [])?.map((item: any, index: number) => {
                      const { id } = item;
                      return <div className="flex-box basic-table-body-tr" key={id}>
                        {
                          (conlumn || [])?.map((tdItem: any) => {
                            const { key, width, render } = tdItem;
                            return <div
                              className="basic-table-body-tr-td"
                              key={`${id}-${key}`}
                              style={{ width }}
                            >
                              {!!render ? render(item[key]) : item[key]}
                            </div>
                          })
                        }
                      </div>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="home-box-item-box">
            <div className="flex-box-justify-between home-item-three-header">
              <div className="home-item-three-header-left">震动/压力统计</div>
            </div>
            <div className="home-item-three-body">
              <BarCharts
                id={'zhendong'}
                data={{
                  dataValue: [],
                  yName: '单位：次',
                  xName: '天数',
                  barRadius: true,
                  showBackground: true,
                  barColor: 'line2',
                }}
              />
            </div>
          </div>
          <div className="home-box-item-box">
            <div className="flex-box-justify-between home-item-three-header">
              <div className="home-item-three-header-left">最新震动数据</div>
            </div>
            <div className="home-item-three-body">
              <LineCharts
                id={'lastest'}
                data={{
                  dataValue: [],
                  timeSelector: true
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="home-center-clicked"
        style={!!centerSelected?.position ? {
          top: centerSelected?.position?.y,
          left: centerSelected?.position?.x,
          opacity: 1
        } : { opacity: 0 }}
      >
        <div className="flex-box-center circle1"><div className="circle1-in"></div></div>
        <div className="circle-line">
          <div className="circle-line-in1"></div>
          <div className="circle-line-in2"></div>
        </div>
        <div className="flex-box-center circle2"><div className="circle2-in"></div></div>
        <div className="flex-box circle-right">
          <div className="flex-box-center circle-right-icon">
            <img src={controlList?.[centerSelected?.index?.[0] * 6 + centerSelected?.index?.[1]]?.img} alt="logo" />
          </div>
          <div className="flex-box-column circle-right-right">
            <div className="flex-box-justify-between circle-right-right-item">
              <div>设备状态</div> {controlStatus?.[controlList?.[centerSelected?.index?.[0] * 6 + centerSelected?.index?.[1]]?.status]}
            </div>
            <div className="flex-box-justify-between circle-right-right-item">
              <div>在线时长</div> {controlList?.[centerSelected?.index?.[0] * 6 + centerSelected?.index?.[1]]?.onLineTime}
            </div>
            <div className="flex-box-justify-between circle-right-right-item">
              <div>同步时间</div> {
                moment(controlList?.[centerSelected?.index?.[0] * 6 + centerSelected?.index?.[1]]?.syncTime || new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
              }
            </div>
            <div className="flex-box-justify-between circle-right-right-item">
              <div>报警次数</div> {controlList?.[centerSelected?.index?.[0] * 6 + centerSelected?.index?.[1]]?.errorNum}
            </div>
            <div className="flex-box circle-right-right-progress">
              <div className="circle-right-right-progress-item">
                <Progress
                  strokeColor={{
                    '0%': '#2bd8ff',
                    '100%': '#1B7FF0',
                  }}
                  percent={controlList?.[centerSelected?.index?.[0] * 6 + centerSelected?.index?.[1]]?.faultRate}
                  format={(percent) => <div><div>在线</div>{percent}%</div>}
                />
              </div>
              <div className="circle-right-right-progress-item">
                <Progress
                  strokeColor={{
                    '0%': '#2bd8ff',
                    '100%': '#1B7FF0',
                  }}
                  percent={controlList?.[centerSelected?.index?.[0] * 6 + centerSelected?.index?.[1]]?.onLine}
                  format={(percent) => <div><div>在线</div>{percent}%</div>}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-box-center circle-bottom">
          <h2>设备位置</h2>
          <h1>{controlList?.[centerSelected?.index?.[0] * 6 + centerSelected?.index?.[1]]?.name}</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;