import './index.less';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useModel, } from 'umi';
import { DatePicker, Button, Form, Row, Col, Tag, } from 'antd';
import PanelTitle from '@/components/PanelTitle';
import ImgDrawer from './ImgDrawer';
import classNames from 'classnames';
import BarCharts from './BarCharts';
import * as _ from 'lodash';
import moment from 'moment';
import PieCharts from './PieCharts';

const RangePicker: any = DatePicker.RangePicker;

const DataStatistics = () => {
    const [form] = Form.useForm();
    const [currentType, setCurrentType] = useState<string>('order');
    const [chartsData, setChartsData] = useState([]);
    const [chartsFooter, setChartsFooter] = useState([]);
    const [pieChartsData, setPieChartsData] = useState([]);
    const [pieChartsTitle, setPieChartsTitle] = useState('毛刺');
    const [timeRange, setTimeRange] = useState([moment(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), moment(new Date().getTime())]);

    const {
        setReady, setOrderQuery, imgDrawerVisible, defectList,
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
        if (!_.isEmpty(orderList)) {
            if (currentType === 'defect' && _.isArray(orderList) && !_.isEmpty(defectList)) {
                let data = [],
                    footer = [],
                    pie = [];
                (orderList || []).forEach((item: any) => {
                    const { key, value } = item;
                    data = data.concat(value);
                    footer = footer.concat(defectList[key + '']);
                    pie = pie.concat({
                        name: defectList[key + ''],
                        value: value,
                    })
                });
                setChartsData(data);
                setChartsFooter(footer);
                setPieChartsData(pie);
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
            if (currentType === 'defect') {
                setChartsData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                setChartsFooter(() => {
                    let obj = [];
                    for (let i = 1; i < Object.keys(defectList).length + 1; i++) {
                        obj = obj.concat(defectList[i + '']);
                    }
                    return obj;
                });
                setPieChartsData([{ name: '', value: 0 }]);
            } else {
                setChartsData([[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]);
                setChartsFooter(prev => {
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
                                            setChartsData([]);
                                            setChartsFooter([]);
                                            setPieChartsData([]);
                                            setCurrentType('order');
                                            onCancel();
                                        }}
                                    >
                                        订单维度
                                    </div>
                                    <div
                                        className={classNames("statistic-btn", { active: currentType === 'img' })}
                                        onClick={() => {
                                            setChartsData([]);
                                            setChartsFooter([]);
                                            setPieChartsData([]);
                                            setCurrentType('img');
                                            onCancel();
                                        }}
                                    >
                                        图片维度
                                    </div>
                                    <div
                                        className={classNames("statistic-btn", { active: currentType === 'defect' })}
                                        onClick={() => {
                                            setChartsData([]);
                                            setChartsFooter([]);
                                            setPieChartsData([]);
                                            setCurrentType('defect');
                                            onCancel();
                                        }}
                                    >
                                        缺陷维度
                                    </div>
                                </Col>
                                <Col span={7} offset={2}>
                                    <Form.Item label="发生时间" name="timeRange" >
                                        <RangePicker
                                            showTime
                                            renderExtraFooter={() => {
                                                return <div className='flex-box' style={{ padding: 6, gap: 8 }}>
                                                    <Tag.CheckableTag checked onClick={() => {
                                                        form.setFieldsValue({ timeRange: [moment(new Date().getTime() - 29 * 24 * 60 * 60 * 1000), moment(new Date().getTime())] })
                                                    }}>近一个月</Tag.CheckableTag>
                                                    <Tag.CheckableTag checked onClick={() => {
                                                        form.setFieldsValue({ timeRange: [moment(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), moment(new Date().getTime())] })
                                                    }}>近一周</Tag.CheckableTag>
                                                    <Tag.CheckableTag checked onClick={() => {
                                                        form.setFieldsValue({ timeRange: [moment(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), moment(new Date().getTime())] })
                                                    }}>近3天</Tag.CheckableTag>
                                                </div>
                                            }}
                                        />
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
                        currentType={currentType}
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
                                console.log(e)
                                setImgQuery((pre: any) => {
                                    return Object.assign({}, pre, {
                                        algStatus: seriesId === 'normal' ? 1 : seriesId === 'abNormal' ? -1 : 0
                                    }, prev === 'defect' ? {} : {
                                        timeRange: [moment(new Date(name).getTime() - 8 * 60 * 60 * 1000 + 1000), moment(new Date(name).getTime() + 16 * 60 * 60 * 1000 - 1000)],
                                    });
                                });
                                if (prev === 'order') {
                                    const data = chartsData[dataIndex][seriesId];
                                    handleViewOrder({ orderNo: data });
                                } else {
                                    handleViewOrder({ orderNo: '' });
                                }

                                return prev;
                            })
                        }}
                    />
                </div>
                <div className="right">
                    <PieCharts
                        currentType={currentType}
                        data={pieChartsData}
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