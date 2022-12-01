import './index.less'
import { Fragment, useEffect, useState } from 'react'
import { useModel, history } from 'umi'
import { Input, DatePicker, Table, Button, Form, Row, Col, Select, Modal, message } from 'antd'
import PanelTitle from '@/components/PanelTitle'
import useResize from '@/hooks/useResize'
import ImgDrawer from './ImgDrawer'
import { isEmpty, isObject } from 'lodash'
import ImgModal from '../Realtime/ImgModal'
import moment from 'moment'

const { Option } = Select;
const RangePicker: any = DatePicker.RangePicker;
const LABEL_RESULT = {
    1: "正常",
    0: "未审核",
    "-1": "异常",
};
const LABEL_PRE_RESULT = {
    'B': "严重",
    'C': "一般"
};
const CLASS_RESULT = {
    1: "success",
    0: "normal",
    "-1": "danger",
};

const History = () => {
    const [form] = Form.useForm();
    const { height } = useResize();
    const {
        setReady, setOrderQuery, imgQuery, setImgQuery, orderList,
        loadOrderList, unmount, handleViewOrder, setImgDrawerVisible, setCurrentOrderId,
        handleOrderDetail, processResult, setProcessResult, loadMaterialList,
    } = useModel('history' as any);
    const query = history?.location?.query || {};
    const [curHeight, setCurHeight] = useState<number>(height);
    const [imgModalData, setImgModalData] = useState<any>({});

    useEffect(() => unmount, []);
    useEffect(() => {
        if (query.id) {
            setOrderQuery({ orderNo: query.id })
            form.setFieldsValue({ orderNo: query.id })
            if (query.id) {
                setImgQuery({
                    ...imgQuery,
                    id: query.id
                })
                setCurrentOrderId(query.id)
                setImgDrawerVisible(true)
            }
        }
        setReady(true)
        // return unmount()
    }, [query, form]);
    useEffect(() => {
        setCurHeight(Math.max(height, 700));
    }, [height]);

    useEffect(() => {
        if (isObject(processResult) && !isEmpty(processResult)) {
            setImgModalData(Object.assign({}, processResult))
        }
    }, [processResult]);

    const columns = [
        { key: 'index', dataIndex: 'index', title: '序号', width: 50, align: 'center' },
        { key: 'orderNo', dataIndex: 'orderNo', title: '订单号' },
        {
            key: 'orderStatus', dataIndex: 'orderStatus', title: '订单状态', render: (result, record) => {
                const { algorithmData } = record;
                return (
                    <span className={CLASS_RESULT[result]}>
                        {result == '-1' ?
                            LABEL_PRE_RESULT[algorithmData?.severity + ''] ? LABEL_PRE_RESULT[algorithmData?.severity + ''] : ''
                            : ''}{LABEL_RESULT[result]}
                    </span>
                )
            }
        },
        {
            key: 'orderTime', dataIndex: 'orderTime', title: '订单时间', render: (text) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        { key: 'alarmImgCount', dataIndex: 'alarmImgCount', title: '报警图片数量', className: "col-alarm" },
        { key: 'falsyAlarmImgCount', dataIndex: 'falsyAlarmImgCount', title: '误报图片数量', className: "col-falsy" },
        { key: 'confirmedAlarmImgCount', dataIndex: 'confirmedAlarmImgCount', title: '异常图片数量', className: "col-confirmed" },
        {
            key: 'auditedImgCount', dataIndex: 'auditedImgCount', title: '审核进度',
            render: (auditedImgCount, { alarmImgCount }) => (
                <span className={alarmImgCount && (alarmImgCount === auditedImgCount) ? 'success' : ''}>
                    {auditedImgCount}/{alarmImgCount}
                </span>
            )
        },
        {
            key: 'view', dataIndex: 'view', title: '查看', width: 180,
            render: (_, record) => {
                const { orderNo } = record;
                return <div className="flex-box">
                    <Button
                        type="text"
                        onClick={() => loadMaterialList(orderNo)}
                    >
                        查看历史
                    </Button>
                    <div className="operation-line" />
                    <Button
                        type="text"
                        onClick={() => handleViewOrder(record)}
                    >
                        查看详情
                    </Button>
                </div>
            }
        }
    ];

    return (
        <div className="page-history">
            <PanelTitle>历史记录</PanelTitle>
            <Form
                form={form}
                className="page-history-order-query"
                initialValues={{}}
                onFinish={(values) => setOrderQuery(values)}
            >
                <div className="left-ghost top" />
                <div className="left-ghost bottom" />
                <Row gutter={24}>
                    <Col span={4}>
                        <Form.Item label="订单号" name="orderNo">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                        <Form.Item label="订单时间" name="timeRange">
                            <RangePicker showTime />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="订单类型" name="orderStatus" initialValue="">
                            <Select >
                                <Option value="-1">异常订单</Option>
                                <Option value="1">正常订单</Option>
                                <Option value="">不限</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} offset={2} className="btns">
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        <Button
                            style={{ margin: '0 8px' }}
                            ghost
                            onClick={() => form.resetFields()}
                        >
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Table
                className="page-history-order-list"
                columns={columns as any}
                rowKey="orderNo"
                dataSource={((orderList?.list || [])).map((i, index) => ({
                    ...i,
                    index: index + 1
                }))}
                pagination={{
                    total: orderList.total,
                    current: orderList.pageNum,
                    pageSize: orderList.pageSize,
                    size: 'small',
                    showSizeChanger: false,
                    onChange: (pageNum, pageSize) => loadOrderList({ pageNum, pageSize })
                }}
                scroll={{ y: curHeight - 330 }}
            />
            <ImgDrawer />

            {
                isObject(imgModalData) && !isEmpty(imgModalData) ?
                    <ImgModal
                        data={imgModalData}
                        onCancel={() => {
                            setProcessResult({});
                            setImgModalData({});
                        }}
                    />
                    : null
            }
        </div>
    )
}

export default History
