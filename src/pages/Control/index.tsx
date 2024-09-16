import React, { useState } from "react";
import { Progress, Form, Button, Select, DatePicker, Radio, Modal } from "antd";
import * as _ from "lodash";
import styles from "./index.module.less";
import gongjianIcon from '@/assets/imgs/gongjian.png';
import moment from "moment";
import LineCharts from "@/components/LineCharts";


const Control: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  const [controlList, setControlList] = useState([
    {
      name: '工区A-C1通道',
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      errorNum: 10,
      faultRate: 58,
      onLine: 88,
    },
    {
      name: '工区A-C2通道',
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      errorNum: 10,
      faultRate: 98,
      onLine: 98,
    },
    {
      name: '工区A-C3通道',
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      errorNum: 10,
      faultRate: 98,
      onLine: 98,
    },
    {
      name: '工区A-C4通道',
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      errorNum: 10,
      faultRate: 98,
      onLine: 98,
    },
    {
      name: '工区A-C5通道',
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      errorNum: 10,
      faultRate: 98,
      onLine: 98,
    },
    {
      name: '工区A-C6通道',
      identifier: 'XUST-0001',
      status: '1',
      onLineTime: '1天08小时21分',
      syncTime: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      errorNum: 10,
      faultRate: 98,
      onLine: 98,
    }
  ]);
  const [visible, setVisible] = useState<any>(null);
  return (
    <div className={`${styles.control} flex-box`}>
      <div className="control-box">
        <div className="control-box-search-box">
          <Form form={form} layout={'inline'} onFinish={(values) => {
            console.log(values);

          }}>
            <Form.Item label="时间范围" name='time'>
              {// @ts-ignore 
                <DatePicker.RangePicker
                  ranges={{
                    Today: [moment(), moment()],
                    '本周': [moment().startOf('week'), moment().endOf('week')],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                  }}
                />
              }
            </Form.Item>
            <Form.Item name="identifier" initialValue={'XUST-0001'}>
              <Select
                showSearch
                style={{ width: '150px' }}
                options={[
                  {
                    value: 'jack',
                    label: 'Jack',
                  },
                  {
                    value: 'lucy',
                    label: 'Lucy',
                  },
                  {
                    value: 'tom',
                    label: 'Tom',
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="aaa" initialValue={'Z'}>
              <Select
                showSearch
                style={{ width: '150px' }}
                options={[
                  {
                    value: 'jack',
                    label: 'Jack',
                  },
                  {
                    value: 'lucy',
                    label: 'Lucy',
                  },
                  {
                    value: 'tom',
                    label: 'Tom',
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="bbb" initialValue={2}>
              <Radio.Group>
                <Radio value={1}>趋势</Radio>
                <Radio value={2}>时域</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">查询</Button>
            </Form.Item>
            <Form.Item >
              <Button type="primary">清空</Button>
            </Form.Item>
          </Form>
        </div>
        {
          (controlList || [])?.map((item: any, index: number) => {
            const {
              name,
              identifier,
              status,
              onLineTime,
              syncTime,
              errorNum,
              faultRate,
              onLine,
            } = item;

            return <div
              className="control-box-item-box"
              key={`control-box-item-box-${index}`}
              onClick={() => {
                setVisible(item);
              }}
            >
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
                    <div>设备状态</div> {status}
                  </div>
                  <div className="flex-box-justify-between home-item-three-body-right-item">
                    <div>在线时长</div> {onLineTime}
                  </div>
                  <div className="flex-box-justify-between home-item-three-body-right-item">
                    <div>同步时间</div> {syncTime}
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
      {!!visible ? (
        <Modal
          className="control-modal"
          visible={!!visible}
          title="设备详情"
          footer={null}
          width={'100vw'}
          centered
          onCancel={() => setVisible(null)}
        >
          <div className="flex-box control-modal-box">
            {Array.from({ length: 6 })?.map((i, index) => {
              return <div className="control-modal-box-item" key={`control-modal-box-item-${index}`}>
                <LineCharts
                  id={`lastest-${index}`}
                  data={{
                    dataValue: [],
                    timeSelector: false
                  }}
                />
              </div>
            })}
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default Control;