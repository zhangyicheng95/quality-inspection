import './index.less'
import { useEffect, useState } from 'react'
import { useModel, history } from 'umi'
import { Input, DatePicker, Table, Button, Form, Row, Col, Select } from 'antd'
import PanelTitle from '@/components/PanelTitle'
import useResize from '@/hooks/useResize'
import ImgDrawer from './ImgDrawer'

const { Option } = Select;
const RangePicker: any = DatePicker.RangePicker;

const History = () => {
    const [form] = Form.useForm()
    const { height } = useResize()
    const [curHeight, setCurHeight] = useState<number>(height)
    const {
        setReady, setOrderQuery, imgQuery, setImgQuery, orderList, loadOrderList,
        unmount, handleViewOrder, setImgDrawerVisible, setCurrentOrderId
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
            key: 'view', dataIndex: 'view', title: '查看', width: 100,
            render: (_, record) => (
                <Button
                    type="text"
                    onClick={() => handleViewOrder(record)}
                >
                    图片列表
                </Button>
            )
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
                dataSource={orderList?.contents?.map((i, index) => ({
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
        </div>
    )
}

export default History