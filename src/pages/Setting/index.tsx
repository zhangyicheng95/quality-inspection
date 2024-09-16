import React, { useEffect, useState, useRef, useMemo } from "react";
import { Form, Input, Table, InputNumber, message, Button, Tree } from "antd";
import * as _ from "lodash";
import styles from "./index.module.less";
import PanelTitle from "@/components/PanelTitle";
import { request } from 'umi';

const titleWidth = 150;
const description = {
  hz: "焊渣{占像素大小阈值，数量阈值}",
  hl: "焊瘤{占像素大小阈值，数量阈值}",
  qk: "气孔{占像素大小阈值，数量阈值}",
  jc: "击穿{占像素大小阈值，数量阈值}",
  cxc: "成型差{占像素大小阈值，数量阈值}",
  dxbj: "大小不均{占像素大小阈值，数量阈值}",
  hanfeng: "缺焊{缺焊宽度阈值，数量阈值}",
  mijiqk: "密集气孔{占像素大小阈值，数量阈值}",
  hanfeng_slop: "焊缝成型角度{角度值}",
  hanfeng_w: "焊缝宽度{最小宽度，最大宽度}",
  hanfeng_Diffw: "焊缝宽度差值{差值}",
  hanfeng_Diffh: "焊缝余高{高度}",
  hanfeng_yb: "焊缝咬边{百分比，咬边深度}"
};
const data = [
  {
    key: 'zd',
    name: '震动阈值',
    描述: "焊渣{占像素大小阈值，数量阈值}",
    area_thre: 12322
  },
  {
    key: 'hz',
    name: '加速度',
    描述: "焊渣{占像素大小阈值，数量阈值}",
    area_thre: 12322
  },
  {
    key: 'hl',
    name: '速度',
    描述: "焊瘤{占像素大小阈值，数量阈值}",
  },
  {
    key: 'qk',
    name: '位移',
    描述: "气孔{占像素大小阈值，数量阈值}",
  },
];
const data1 = [
  {
    key: 'zd',
    name: '压力阈值',
    描述: "焊渣{占像素大小阈值，数量阈值}",
    area_thre: 12322
  },
  {
    key: 'hz',
    name: '识别的敏感度',
    描述: "焊渣{占像素大小阈值，数量阈值}",
    area_thre: 12322
  },
  {
    key: 'hl',
    name: '裂纹的最小长度',
    描述: "焊瘤{占像素大小阈值，数量阈值}",
  },
  {
    key: 'qk',
    name: '宽度',
    描述: "气孔{占像素大小阈值，数量阈值}",
  },
];
const Setting: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  const { validateFields, } = form;

  const onFinish = () => {
    validateFields()
      .then((values) => {
        const result = Object.entries(values).reduce((pre: any, cur: any) => {
          const title = cur[0].split('@');
          if (!title[1]) {
            return pre;
          }
          return Object.assign({}, pre, {
            [title[0]]: Object.assign({}, pre[title[0]], {
              [title[1]]: cur[1],
              描述: description[title[0]]
            })
          })
        }, {});
        console.log(result);
        message.success('保存成功');
      })
      .catch((err) => {
        const { errorFields } = err;
        _.isArray(errorFields) && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
      });
  };

  const columns2D: any = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: titleWidth,
      render: text => <span style={{ fontSize: 18, color: '#38E8F7', fontWeight: 500 }}>{text}</span>,
    },
    {
      // title: '缺陷像素面积',
      dataIndex: 'area_thre',
      key: 'area_thre',
      align: 'center',
      render: (text, record) => {
        return <Form.Item
          name={`${record.key}@area_thre`}
          initialValue={text || undefined}
          style={{ marginBottom: 0, padding: '12px 8px' }}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      },
    },
  ];
  const columns3D: any = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: titleWidth,
      render: text => <span style={{ fontSize: 18, color: '#38E8F7', fontWeight: 500 }}>{text}</span>,
    },
    {
      // title: '缺陷像素面积',
      dataIndex: 'area_thre',
      key: 'area_thre',
      align: 'center',
      render: (text, record) => {
        return <Form.Item
          name={`${record.key}@area_thre`}
          initialValue={text || undefined}
          style={{ marginBottom: 0, padding: '12px 8px' }}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      },
    },
  ]
  return (
    <div className={`${styles.setting} flex-box`}>
      <div className="body">
        <PanelTitle style={{ padding: '48px 0' }}>震动</PanelTitle>
        <Form
          form={form}
          layout="vertical"
          scrollToFirstError
        >
          <Table
            pagination={false}
            columns={columns2D}
            dataSource={data.filter((i: any) => !i.hidden)}
          />
        </Form>
        <PanelTitle style={{ padding: '48px 0' }}>压力</PanelTitle>
        <Form
          form={form}
          layout="horizontal"
          scrollToFirstError
        >
          <Table
            pagination={false}
            columns={columns3D}
            dataSource={data1.filter((i: any) => !i.hidden)}
          />
        </Form>
      </div>
      <div className="footer flex-box">
        <Button type="primary" onClick={() => onFinish()}>确认</Button>
      </div>
    </div>
  );
};

export default Setting;