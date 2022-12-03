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
import PieCharts from './PieCharts';

const RangePicker: any = DatePicker.RangePicker;
// 搅拌桶名称对应关系
const labelFormat = (type: string) => {
    switch (type) {
        case '1':
            return '法兰';
            break;
        case '2':
            return '球罐';
            break;
        case '3':
            return '前锥';
            break;
        case '4':
            return '中桶';
            break;
        case '5':
            return '小中桶';
            break;
        case '6':
            return '后锥';
            break;
        case '7':
            return '滚道(大)';
            break;
        case '8':
            return '滚道(小)';
            break;
        case '9':
            return '圈A';
            break;
        case '10':
            return '圈B';
            break;
    }
}

const DataStatistics = () => {
    const [form] = Form.useForm();
    const [currentType, setCurrentType] = useState<string>('order');
    const [chartsData, setChartsData] = useState([]);
    const [chartsFooter, setChartsFooter] = useState([]);
    const [pieChartsData, setPieChartsData] = useState([]);
    const [pieChartsTitle, setPieChartsTitle] = useState('法兰');
    const [timeRange, setTimeRange] = useState([moment(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), moment(new Date().getTime())]);

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
        form.setFieldsValue({
            timeRange: [moment(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), moment(new Date().getTime())]
        });
        setTimeRange([moment(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), moment(new Date().getTime())]);
    }, [currentType]);

    useEffect(() => {
        const startTime = new Date(moment(timeRange[0]).format('YYYY-MM-DD')).getTime();
        const endTime = new Date(moment(timeRange[1]).format('YYYY-MM-DD')).getTime();
        if (_.isObject(orderList) && !_.isEmpty(orderList)) {
            if (currentType === 'label') {
                const result = Object.entries(orderList).map((item: any) => {
                    const { normal, abNormal } = item[1];
                    const footer = item[0];
                    const data = [_.isArray(normal) ? normal.length : normal || undefined, _.isArray(abNormal) ? abNormal.length : abNormal || undefined];
                    return [footer, data];
                });
                setChartsData(result.map(item => item[1]));
                setChartsFooter(result.map(item => labelFormat(item[0] + '')));
                setPieChartsData([{ name: '正常', value: result[0][1][0] }, { name: '异常', value: result[0][1][1] }])
            } else {
                let obj = {};
                if (Object.keys(orderList).length === ((endTime - startTime) / 1000 / 60 / 60 / 24 + 1)) {
                    // 正常返回搜索天数的数据
                    obj = Object.assign({}, orderList);
                } else {
                    // 返回的数据不足搜索天数
                    for (let i = 0; i < ((endTime - startTime) / 1000 / 60 / 60 / 24 + 1); i++) {
                        obj = Object.assign({}, obj, {
                            [moment(new Date(startTime + i * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD')]: { normal: 0, abNormal: 0 }
                        });
                    }
                    obj = Object.assign({}, obj, orderList);
                }
                const result = Object.entries(obj).sort((a: any, b: any) => a[0] - b[0]).map((item: any) => {
                    const { normal, abNormal } = item[1];
                    const footer = new Date(item[0]).getTime();
                    const data = [_.isArray(normal) ? normal.length : normal || undefined, _.isArray(abNormal) ? abNormal.length : abNormal || undefined];
                    return [footer, data];
                }).sort();
                setChartsData(result.map(item => item[1]));
                setChartsFooter(result.map(item => moment(item[0]).format('YYYY-MM-DD')));
                setPieChartsData(() => {
                    let normal = 0,
                        abNormal = 0;
                    result.forEach(item => {
                        normal += (!!item[1][0] ? item[1][0] : 0);
                        abNormal += (!!item[1][1] ? item[1][1] : 0);
                    });
                    return [{ name: '正常', value: normal }, { name: '异常', value: abNormal }];
                })

            }
        } else {
            setChartsData([[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]);
            setChartsFooter(prev => {
                if (currentType === 'label') {
                    let obj = [];
                    for (let i = 1; i < 11; i++) {
                        obj = obj.concat(labelFormat(i + ''));
                    }
                    return obj;
                }
                let obj = [];
                for (let i = 0; i < ((endTime - startTime) / 1000 / 60 / 60 / 24 + 1); i++) {
                    obj = obj.concat(moment(new Date(startTime + i * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'));
                }
                return obj;
            });
            setPieChartsData([{ name: '正常', value: 0 }, { name: '异常', value: 0 }])
            // setChartsData([[320, 120], [132, 302], [301, 101], [334, 134], [390, 90], [330, 230], [320, 210]]);
            // setChartsFooter([labelFormat('1'), labelFormat('2'), labelFormat('3'), 4, 5, 6, 7]);
        }
    }, [orderList, currentType, timeRange]);

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
                            onFinish={(values) => {
                                setTimeRange(values.timeRange);
                                setOrderQuery({ ...values, currentType });
                            }}
                        >
                            <div className="left-ghost top" />
                            <div className="left-ghost bottom" />
                            <Row gutter={24}>
                                <Col span={7} className="statistic-btn-box">
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
                                    {/* <div
                                        className={classNames("statistic-btn", { active: currentType === 'label' })}
                                        onClick={() => {
                                            setCurrentType('label');
                                            onCancel();
                                        }}
                                    >
                                        焊缝维度
                                    </div> */}
                                </Col>
                                <Col span={7} offset={2}>
                                    <Form.Item label="发生时间" name="timeRange" >
                                        <RangePicker showTime />
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={2} className="btns">
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
            <div className="page-history-order-list flex-box" style={isIframe ? { height: '100%', margin: 0 } : {}}>
                <div className="left">
                    <BarCharts
                        data={chartsData}
                        Xdata={chartsFooter}
                        onClick={(e: any) => {
                            if (isIframe) {
                                const href = window.location.href.split('?')[0];
                                window.open(href, '_blank');
                                return;
                            }
                            setCurrentType((prev: string) => {
                                const { name, seriesId, dataIndex } = e;
                                setImgQuery((pre: any) => {
                                    return Object.assign({}, pre, {
                                        qualified: seriesId === 'normal' ? 1 : seriesId === 'abNormal' ? -1 : 0
                                    }, prev === 'label' ? {} : {
                                        timeRange: [moment(new Date(name).getTime() - 8 * 60 * 60 * 1000 + 1000), moment(new Date(name).getTime() + 16 * 60 * 60 * 1000 - 1000)],
                                    })
                                })
                                if (prev === 'order') {
                                    const data = chartsData[dataIndex][seriesId];
                                    handleViewOrder({ orderNo: data });
                                } else {
                                    handleViewOrder({ orderNo: '' });
                                }

                                return prev;
                            })
                        }}
                        onXClick={(e: any) => {
                            const curData = chartsData[e.dataIndex];
                            setPieChartsData([{ name: '正常', value: curData[0] }, { name: '异常', value: curData[1] }]);
                            setPieChartsTitle(e.value);
                        }}
                    />
                </div>
                <div className="right">
                    <PieCharts
                        data={pieChartsData}
                        title={currentType === 'label' ? pieChartsTitle : ''}
                    />
                </div>
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