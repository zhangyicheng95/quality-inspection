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
    key: 'hz',
    name: '焊渣',
    描述: "焊渣{占像素大小阈值，数量阈值}",
    area_thre: 12322
  },
  {
    key: 'hl',
    name: '焊瘤',
    描述: "焊瘤{占像素大小阈值，数量阈值}",
  },
  {
    key: 'qk',
    name: '气孔',
    描述: "气孔{占像素大小阈值，数量阈值}",
  },
  {
    key: 'jc',
    name: '击穿',
    描述: '击穿{占像素大小阈值，数量阈值}',
  },
  {
    key: 'cxc',
    name: '成型差',
    描述: "成型差{占像素大小阈值，数量阈值}",
  },
  {
    key: 'dxbj',
    name: '大小不均',
    描述: "大小不均{占像素大小阈值，数量阈值}",
  },
  {
    key: 'hanfeng',
    name: '缺焊',
    描述: "缺焊{缺焊宽度阈值，数量阈值}",
  },
  {
    key: 'mijiqk',
    name: '密集气孔',
    描述: "密集气孔{占像素大小阈值，数量阈值}",
  },
  {
    key: 'hanfeng_slop',
    name: '焊缝成型角度',
    描述: "焊缝成型角度{角度值}",
    hidden: true,
  },
  {
    key: 'hanfeng_w',
    name: '焊缝宽度',
    描述: "焊缝宽度{最小宽度，最大宽度}",
    hidden: true,
  },
  {
    key: 'hanfeng_Diffw',
    name: '焊缝宽度差值',
    描述: "焊缝宽度差值{差值}",
    hidden: true,
  },
  {
    key: 'hanfeng_Diffh',
    name: '焊缝余高',
    描述: "焊缝余高{高度}",
    hidden: true,
  },
  {
    key: 'hanfeng_yb',
    name: '焊缝咬边',
    描述: "焊缝咬边{百分比，咬边深度}",
    hidden: true,
  }
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
      title: '缺陷像素面积',
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
    {
      title: '缺陷数量',
      dataIndex: 'num_thre',
      key: 'num_thre',
      align: 'center',
      render: (text, record) => {
        return <Form.Item
          name={`${record.key}@num_thre`}
          initialValue={text || undefined}
          style={{ marginBottom: 0, padding: '12px 8px' }}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      },
    },
  ];
  const columns3D = [
    {
      title: <span style={{ fontSize: 18, }}>焊缝成型角度</span>,
      width: titleWidth,
      children: [
        {
          title: <span style={{ fontSize: 18, }}>焊缝宽度</span>,
          width: titleWidth,
          children: [
            {
              title: <span style={{ fontSize: 18, }}>焊缝宽度偏差</span>,
              width: titleWidth,
              children: [
                {
                  title: <span style={{ fontSize: 18, }}>余高</span>,
                  width: titleWidth,
                  children: [
                    {
                      title: <span style={{ fontSize: 18, }}>咬边</span>,
                      width: titleWidth,
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      title: <Form.Item
        name={`hanfeng_slop@angle`}
        label="角度值"
        initialValue={undefined}
        style={{ marginBottom: 0 }}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>,
      children: [
        {
          title: <Form.Item
            name={`hanfeng_w@max_w`}
            label='最大值 (mm)'
            initialValue={undefined}
            style={{ marginBottom: 0 }}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>,
          children: [
            {
              title: <Form.Item
                name={`hanfeng_Diffw@diff_w`}
                label='最大偏差值 (mm)'
                initialValue={undefined}
                style={{ marginBottom: 0 }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>,
              children: [
                {
                  title: <Form.Item
                    name={`hanfeng_Diffh@diff_h`}
                    label="高度"
                    initialValue={undefined}
                    style={{ marginBottom: 0 }}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>,
                  children: [
                    {
                      title: <Form.Item
                        name={`hanfeng_yb@precentage`}
                        label='咬边比例 (%)'
                        initialValue={undefined}
                        style={{ marginBottom: 0 }}
                      >
                        <InputNumber style={{ width: '100%' }} />
                      </Form.Item>
                    },
                  ]
                }
              ]
            }
          ]
        },
        {
          title: <Form.Item
            name={`hanfeng_w@min_w`}
            label="最小值 (mm)"
            initialValue={undefined}
            style={{ marginBottom: 0 }}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>,
          children: [
            {
              title: '',
              children: [
                {
                  title: '',
                  children: [
                    {
                      title: <Form.Item
                        name={`hanfeng_yb@deepth`}
                        label='咬边深度 (mm)'
                        initialValue={undefined}
                        style={{ marginBottom: 0 }}
                      >
                        <InputNumber style={{ width: '100%' }} />
                      </Form.Item>
                    }
                  ]
                }
              ]
            }
          ]
        },
      ],
    },
  ]
  return (
    <div className={`${styles.setting} flex-box`}>
      <div className="body">
        <PanelTitle style={{ padding: '48px 0' }}>2D</PanelTitle>
        <Form
          form={form}
          layout="vertical"
          scrollToFirstError
        >
          <Table
            pagination={false}
            columns={columns2D}
            dataSource={data.filter(i => !i.hidden)}
          />
        </Form>
        <PanelTitle style={{ padding: '48px 0' }}>3D</PanelTitle>
        <Form
          form={form}
          layout="horizontal"
          scrollToFirstError
        >
          <Table
            pagination={false}
            columns={columns3D}
            className="table-3D"
            size="middle"
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