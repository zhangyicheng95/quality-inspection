import './index.less';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useModel, } from 'umi';
import { DatePicker, Button, Form, Row, Col, } from 'antd';
import PanelTitle from '@/components/PanelTitle';
import ImgDrawer from './ImgDrawer';
import classNames from 'classnames';
import BarCharts from './BarCharts';
import * as _ from 'lodash';
import moment from 'moment';

const RangePicker: any = DatePicker.RangePicker;

const DataStatistics = () => {
    const [form] = Form.useForm();
    const [currentType, setCurrentType] = useState<string>('order');
    const [chartsData, setChartsData] = useState([]);
    const [chartsFooter, setChartsFooter] = useState([]);
    const {
        setReady, setOrderQuery, imgDrawerVisible,
        orderList, unmount, handleViewOrder, setImgQuery,
    } = useModel('dataStatistics' as any)

    useEffect(() => {
        unmount(currentType);
        setReady(true);
    }, [currentType])
    useEffect(() => {
        setReady(true);
        // return unmount()
    }, [form])

    useEffect(() => {
        console.log('orderList', orderList)
        if (_.isObject(orderList) && !_.isEmpty(orderList)) {
            setChartsData(() => {
                return Object.entries(orderList).map((item: any) => {
                    const { normal, abNormal } = item[1];
                    return [_.isArray(normal) ? normal.length : normal || undefined, _.isArray(abNormal) ? abNormal.length : abNormal || undefined];
                })
            });
            setChartsFooter(Object.keys(orderList));
        } else {
            // setChartsData([[320, 120], [132, 302], [301, 101], [334, 134], [390, 90], [330, 230], [320, 210]]);
            // setChartsFooter([1662376480307, 1662376580307, 1662376680307, 1662376780307, 1662376880307, 1662376980307, 1662377080307]);
        }
    }, [orderList]);

    const onCancel = () => {
        form.resetFields();
    }
    const isIframe = useMemo(() => {
        return window.location.hash.indexOf('iframe') > -1;
    }, [window.location.hash]);

    return (
        <div className="page-history">
            {
                isIframe ? null :
                    <Fragment>
                        <PanelTitle>数据统计</PanelTitle>
                        <Form
                            form={form}
                            className="page-history-order-query"
                            initialValues={{}}
                            onFinish={(values) => setOrderQuery({ ...values, currentType })}
                        >
                            <div className="left-ghost top" />
                            <div className="left-ghost bottom" />
                            <Row gutter={24}>
                                <Col span={4} className="statistic-btn-box">
                                    <div
                                        className={classNames("statistic-btn", { active: currentType === 'order' })}
                                        onClick={() => {
                                            setCurrentType('order');
                                            onCancel();
                                        }}
                                    >
                                        订单维度
                                    </div>
                                    <div
                                        className={classNames("statistic-btn", { active: currentType === 'img' })}
                                        onClick={() => {
                                            setCurrentType('img');
                                            onCancel();
                                        }}
                                    >
                                        图片维度
                                    </div>
                                </Col>
                                <Col span={6} offset={2}>
                                    <Form.Item label="发生时间" name="timeRange" >
                                        <RangePicker showTime />
                                    </Form.Item>
                                </Col>
                                <Col span={10} offset={2} className="btns">
                                    <Button type="primary" htmlType="submit">
                                        搜索
                                    </Button>
                                    <Button
                                        style={{ margin: '0 8px' }}
                                        ghost
                                        onClick={() => onCancel()}
                                    >
                                        重置
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Fragment>
            }
            <div className="page-history-order-list" style={isIframe ? { height: '100%', margin: 0 } : {}}>
                <BarCharts
                    data={chartsData}
                    Xdata={chartsFooter}
                    onClick={(e: any) => {
                        setCurrentType((prev: string) => {
                            console.log(e);
                            const { name, seriesId, dataIndex } = e;
                            setImgQuery((prev: any) => {
                                return Object.assign({}, prev, {
                                    timeRange: [moment(new Date(name).getTime() - 8 * 60 * 60 * 1000 + 1000), moment(new Date(name).getTime() + 16 * 60 * 60 * 1000 - 1000)],
                                    qualified: seriesId === 'normal' ? 1 : -1
                                })
                            })
                            if (prev === 'order') {
                                const data = Object.values(orderList)[dataIndex][seriesId];
                                handleViewOrder({ orderId: data });
                            } else {
                                handleViewOrder({ orderId: '' });
                            }

                            return prev;
                        })
                    }}
                />
            </div>
            {
                imgDrawerVisible ?
                    <ImgDrawer />
                    : null
            }
        </div>
    )
}

export default DataStatistics