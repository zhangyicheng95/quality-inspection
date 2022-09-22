import './index.less'
import { Fragment, useEffect, useState } from 'react'
import { useModel, history } from 'umi'
import { Input, DatePicker, Table, Button, Form, Row, Col, Select, Modal, message } from 'antd'
import PanelTitle from '@/components/PanelTitle'
import useResize from '@/hooks/useResize'
import ImgDrawer from './ImgDrawer'
import { isEmpty, isObject } from 'lodash'
import ImgModal from '../Realtime/ImgModal'

const { Option } = Select;
const RangePicker: any = DatePicker.RangePicker;
// @ts-ignore
const systemType = window?.QUALITY_CONFIG?.type;

const History = () => {
    const [form] = Form.useForm()
    const { height } = useResize()
    const [curHeight, setCurHeight] = useState<number>(height)
    const [imgModalData, setImgModalData] = useState<any>({});
    const {
        setReady, setOrderQuery, imgQuery, setImgQuery, orderList, loadOrderList,
        unmount, handleViewOrder, setImgDrawerVisible, setCurrentOrderId,
        handleOrderDetail, processResult, setProcessResult,
    } = useModel('history' as any)
    const query = history?.location?.query || {}

    useEffect(() => unmount, [])
    useEffect(() => {
        if (query.orderId) {
            setOrderQuery({ orderId: query.orderId })
            form.setFieldsValue({ orderId: query.orderId })
            if (query.id) {
                setImgQuery({
                    ...imgQuery,
                    id: query.id
                })
                setCurrentOrderId(query.orderId)
                setImgDrawerVisible(true)
            }
        }
        setReady(true)
        // return unmount()
    }, [query, form])
    useEffect(() => {
        setCurHeight(Math.max(height, 700))
    }, [height])

    const columns = [
        { key: 'index', dataIndex: 'index', title: '序号', width: 50, align: 'center' },
        { key: 'orderId', dataIndex: 'orderId', title: '订单号' },
        { key: 'orderTime', dataIndex: 'orderTime', title: '订单时间' },
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
                const { orderId } = record;
                return <div className="flex-box">
                    {
                        (systemType === 'jbt' || systemType === 'tbg') ?
                            <Fragment>
                                <Button
                                    type="text"
                                    onClick={() => handleOrderDetail(orderId)}
                                >
                                    查看历史
                                </Button>
                                <div className="operation-line" />
                            </Fragment>
                            :
                            null
                    }
                    <Button
                        type="text"
                        onClick={() => handleViewOrder(record)}
                    >
                        图片列表
                    </Button>
                </div>
            }
        }
    ]

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
                        <Form.Item label="订单号" name="orderId">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6} offset={2}>
                        <Form.Item label="发生时间" name="timeRange">
                            <RangePicker showTime />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="订单类型" name="result">
                            <Select defaultValue="" >
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
                rowKey="id"
                dataSource={([{}, {}]).map((i, index) => ({
                    ...i,
                    index: index + 1
                }))}
                pagination={{
                    total: orderList.totalRecord,
                    current: orderList.page,
                    pageSize: orderList.size,
                    size: 'small',
                    showSizeChanger: false,
                    onChange: (page, size) => loadOrderList({ page, size })
                }}
                scroll={{ y: curHeight - 330 }}
            />
            <ImgDrawer />

            <Modal
                className='page-history-img-modal'
                visible={isObject(processResult) && !isEmpty(processResult)}
                title={"预览结果"}
                width="100vw"
                centered
                // onOk={() => { }}
                footer={null}
                onCancel={() => {
                    setProcessResult({});
                }}
            >
                <div className={`img ${systemType}`} />
                <div className="jbt-box">
                    {(systemType === 'jbt' ? jbtLines : tbgLines).map((item: any, index: number) => {
                        const { label, x1, y1, x2, y2, radio } = item;
                        return <div
                            key={index}
                            className="jbt-box-item-line"
                            style={{
                                left: x1 * 100 + '%',
                                top: y1 * 100 + '%',
                                right: (1 - x2) * 100 + '%',
                                bottom: (1 - y2) * 100 + '%',
                                borderRadius: radio,
                            }}
                            onClick={() => {
                                if (!isObject(processResult) || isEmpty(processResult)) {
                                    message.warning('暂无结果信息');
                                    return;
                                }
                                setImgModalData(Object.assign({}, processResult, {
                                    label,
                                },
                                    //@ts-ignore
                                    !!processResult?.bounding_boxes ? {
                                        //@ts-ignore
                                        globalSrcPath: processResult?.global_src_path,
                                        //@ts-ignore
                                        boundingBoxes: processResult?.bounding_boxes.map(
                                            (item: any) => Object.assign({}, item, {
                                                localSrcList: item?.local_src_list
                                            })
                                        ),
                                    } : {}))
                            }}
                        />
                    })}
                </div>
            </Modal>

            {
                isObject(imgModalData) && !isEmpty(imgModalData) ?
                    <ImgModal
                        data={imgModalData}
                        onCancel={() => setImgModalData({})}
                    />
                    : null
            }
        </div>
    )
}

export default History

const jbtLines = [
    {
        label: 10,
        x1: 0.38,
        y1: 0.045,
        x2: 0.605,
        y2: 0.055
    },
    {
        label: 9,
        x1: 0.38,
        y1: 0.069,
        x2: 0.605,
        y2: 0.079
    },
    {
        label: 8,
        x1: 0.34,
        y1: 0.205,
        x2: 0.65,
        y2: 0.215
    },
    {
        label: 7,
        x1: 0.34,
        y1: 0.225,
        x2: 0.65,
        y2: 0.235
    },
    {
        label: 6,
        x1: 0.33,
        y1: 0.3,
        x2: 0.66,
        y2: 0.31
    },
    {
        label: 5,
        x1: 0.3,
        y1: 0.44,
        x2: 0.69,
        y2: 0.45
    },
    {
        label: 4,
        x1: 0.3,
        y1: 0.55,
        x2: 0.69,
        y2: 0.56
    },
    {
        label: 3,
        x1: 0.3,
        y1: 0.755,
        x2: 0.69,
        y2: 0.765
    },
    {
        label: 2,
        x1: 0.36,
        y1: 0.95,
        x2: 0.645,
        y2: 0.96
    },
    {
        label: 1,
        x1: 0.45,
        y1: 0.98,
        x2: 0.55,
        y2: 0.99
    }
];

const tbgLines = [
    {
        label: 1,
        x1: 0.435,
        y1: 0.12,
        x2: 0.55,
        y2: 0.16
    },
    {
        label: 2,
        x1: 0.6,
        y1: 0.095,
        x2: 0.675,
        y2: 0.26,
        radio: '50%',
    },
    {
        label: 3,
        x1: 0.44,
        y1: 0.85,
        x2: 0.55,
        y2: 0.89
    },
    {
        label: 4,
        x1: 0.6,
        y1: 0.765,
        x2: 0.675,
        y2: 0.925,
        radio: '50%',
    }
];