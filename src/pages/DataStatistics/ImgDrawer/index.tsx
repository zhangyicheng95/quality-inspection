import './index.less'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import { Form, Radio, DatePicker, Drawer, InputNumber, Table, Row, Col, Button, Select } from 'antd'
import ImgViewer from '@/components/ImgViewer'
import useResize from '@/hooks/useResize'
import { delay } from '@/utils/utils'
import moment from 'moment'

const format = (time) => moment(time).format("YYYY-MM-DD HH:mm:ss");
const RangePicker: any = DatePicker.RangePicker;
const { Option } = Select;

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
const resultOptions = [
    { value: 1, label: '正常' },
    { value: -1, label: '异常' },
    { value: 0, label: '不限' }
]
const auditOptions = [
    { value: 0, label: '未审核' },
    { value: 2, label: '已审核' },
    { value: 3, label: '不限' }
]

interface Props {

}

const ImgDrawer: React.FC<Props> = (props: any) => {
    const {
        currentOrderIdList, setCurrentOrderIdList, currentOrderId, setCurrentOrderId,
        imgQuery, setImgQuery, imgList, loadImgList,
        clickedType, setClickedType, selectedTime,
        imgDrawerVisible, setImgDrawerVisible, resetImgDrawer,
        imgViewerVisible, setImgViewerVisible, imgViewerData, setImgViewerData,
        handleAudit, loadSiblingImg
    } = useModel('dataStatistics' as any)
    const [form] = Form.useForm()
    const { height } = useResize()
    const [curHeight, setCurHeight] = useState<number>(height)

    useEffect(() => {
        setCurHeight(Math.max(height, 700))
    }, [height])

    useEffect(() => {
        const param = Object.assign({}, imgQuery, { qualified: clickedType, timeRange: selectedTime, });
        form.setFieldsValue(param)
    }, [form, imgQuery, clickedType])

    const handleViewImg = record => () => {
        setImgViewerData(record)
        setImgViewerVisible(true)
    }

    const handleGetSiblingImg = (direction, id) => () => loadSiblingImg({
        direction,
        currentImgId: id
    })

    const columns = [
        { key: 'index', dataIndex: 'index', title: '序号', width: 50, align: 'center' },
        { key: 'orderId', dataIndex: 'orderId', title: '订单号' },
        { key: 'id', dataIndex: 'id', title: '图片序号', width: 80 },
        {
            key: 'time', dataIndex: 'time', title: '图片时间',
            render: time => format(time)
        },
        {
            key: 'result', dataIndex: 'result', title: '检测结果', width: 80,
            render: (result, record) => {
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
            key: 'audit', dataIndex: 'audit', title: '人工判断', width: 80,
            render: result => (
                <span className={CLASS_RESULT[result]}>
                    {LABEL_RESULT[result] || '--'}
                </span>
            )
        },
        {
            key: 'view', dataIndex: 'view', title: '图片详情', width: 100,
            render: (_, record) => (
                <Button
                    type="text"
                    onClick={handleViewImg(record)}
                >
                    查看大图
                </Button>
            )
        }
    ]
    return (
        <Drawer
            className='page-history-img-drawer'
            visible={imgDrawerVisible}
            title={currentOrderIdList?.length ?
                (
                    <span>
                        订单号:&nbsp;
                        <Select defaultValue={currentOrderIdList[0]} onChange={(e) => {
                            setCurrentOrderId(e)
                        }}>
                            {
                                currentOrderIdList.map((item: any) => {
                                    return <Option value={item}>{item}</Option>
                                })
                            }
                        </Select>
                    </span>
                ) : <div style={{ height: 30 }} />}
            width={1061}
            onClose={async () => {
                setImgDrawerVisible(false)
                await delay(300)
                resetImgDrawer()
            }}
        >
            <Form
                form={form}
                className="page-history-img-query"
                initialValues={{}}
                onFinish={setImgQuery}
            >
                <div className="left-ghost top" />
                <div className="left-ghost bottom" />
                <Row gutter={24}>
                    <Col span={7}>
                        <Form.Item label="图片序号" name="id">
                            <InputNumber min={0} precision={0} />
                        </Form.Item>
                    </Col>
                    <Col span={10} >
                        <Form.Item label="起止时间" name="timeRange">
                            <RangePicker showTime />
                        </Form.Item>
                    </Col>
                    <Col span={7} >
                        <Form.Item
                            label="检测结果"
                            name="qualified"
                            initialValue={clickedType}
                        >
                            <Radio.Group optionType='button' options={resultOptions} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="审核状态" name="isAudited">
                            <Radio.Group optionType='button' options={auditOptions} />
                        </Form.Item>
                    </Col>
                    <Col span={7} offset={9} className="btns">
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
                className="page-history-img-list"
                columns={columns as any}
                rowKey="id"
                dataSource={(imgList?.contents || []).map((i, index) => ({
                    ...i,
                    index: index + 1
                }))}
                pagination={{
                    total: imgList.totalRecord,
                    current: imgList.page,
                    pageSize: imgList.size,
                    size: 'small',
                    showSizeChanger: false,
                    onChange: (page, size) => loadImgList({ page, size })
                }}
                scroll={{ y: curHeight - 290 }}
            />
            {imgViewerVisible && <ImgViewer
                data={imgViewerData}
                onClose={() => {
                    setImgViewerVisible(false)
                    setImgViewerData({})
                    loadImgList()
                }}
                onAudit={handleAudit}
                onPrev={handleGetSiblingImg(-1, imgViewerData.id)}
                onNext={handleGetSiblingImg(1, imgViewerData.id)}
            />}
        </Drawer>
    )
}

export default ImgDrawer
