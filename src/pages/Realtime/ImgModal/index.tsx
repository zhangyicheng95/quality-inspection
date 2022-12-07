import './index.less';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Select, Switch } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import * as _ from 'lodash';
import { useModel } from 'umi';

interface Props {
    data: any;
    onOk?: any;
    onCancel: any;
}

const ImgModal: React.FC<Props> = (props) => {
    const {
        handleOrderDetail, materialList, currentOrderId
    } = useModel('history' as any);
    const { data = {}, onCancel, } = props;
    const { globalSrcPath = '', boundingBoxes = [], orderNo } = data;
    const [selectedUrl, setSelectedUrl] = useState(0);
    const [selectedNum, setSelectedNum] = useState(0);
    // @ts-ignore
    const [carType, setCarType] = useState(_.isObject(materialList[0]) && _.hasIn(materialList[0], 'id') && materialList[0]?.id);
    const [backImgType, setBackImgType] = useState(2);
    const [ifShowOk, setIfShowOk] = useState(true);
    const [backImgSize, setBackImgSize] = useState(1);

    const list: any = useMemo(() => {
        return _.isArray(boundingBoxes) ? boundingBoxes.filter(i => ifShowOk ? i.type == backImgType : (i.type == backImgType && i.algStatus == '-1')) : [];
    }, [boundingBoxes, backImgType, ifShowOk]);

    const showImg = useMemo(() => {
        const parent = list[selectedUrl]?.localSrcList;
        return !!parent && parent?.length && parent[selectedNum];
    }, [list, selectedUrl, selectedNum]);

    useEffect(() => {
        const img = new Image();
        img.src = globalSrcPath;
        img.onload = (res) => {
            const { width, height } = img;
            setBackImgSize(width / height);
            console.log(35, width, height);
        };
    }, [globalSrcPath]);

    return (
        <Modal
            className='page-history-img-modal'
            visible={true}
            title={
                <div className="flex-box" style={{ gap: 16 }}>
                    <div style={{ marginRight: 24 }}>预览结果</div>
                    {
                        materialList?.length > 5 ?
                            <Select
                                style={{ width: 200 }}
                                // @ts-ignore
                                defaultValue={_.isObject(materialList[0]) && _.hasIn(materialList[0], 'id') && materialList[0]?.id}
                                onChange={val => {
                                    handleOrderDetail(currentOrderId, val);
                                }}
                                options={(materialList || []).map((car: any, index: number) => {
                                    const { id, cname } = car;
                                    return {
                                        value: id,
                                        label: cname
                                    }
                                })
                                }
                            />
                            :
                            (materialList || []).map((car: any, index: number) => {
                                const { id, cname } = car;
                                return <Button key={id} type={carType === id ? "primary" : "default"} onClick={() => {
                                    handleOrderDetail(currentOrderId, id);
                                    setCarType(id);
                                }}>
                                    {cname}
                                </Button>
                            })
                    }
                    <Button style={{ marginLeft: 24 }} type={backImgType === 2 ? "primary" : "default"} onClick={() => setBackImgType(2)}>
                        2D
                    </Button>
                    <Button type={backImgType === 3 ? "primary" : "default"} onClick={() => setBackImgType(3)}>
                        3D
                    </Button>
                    <Switch
                        checkedChildren="显示OK图"
                        unCheckedChildren="隐藏OK图"
                        defaultChecked={ifShowOk}
                        onChange={checked => setIfShowOk(checked)}
                    />
                </div>
            }
            width="100vw"
            centered
            // onOk={() => { }}
            footer={null}
            onCancel={() => {
                onCancel();
            }}
        >
            <div className={`page-history-img-modal-body flex-box`}>
                <div
                    className={"body-left"}
                    style={{
                        backgroundImage: globalSrcPath ? `url(${globalSrcPath || ''}?timestamp=${new Date().getTime()})` : '',
                        backgroundSize: '100% 100%',
                        width: '50%'
                    }}
                >
                    {
                        (list || []).map(
                            (item: any, index: number) => {
                                let { points, type, algStatus } = item;
                                points = _.isArray(points) ? points.filter(Boolean) : [];
                                if (backImgType != type || !points.length || (!ifShowOk && algStatus == 1)) {
                                    return null;
                                }
                                return (
                                    <div
                                        key={index}
                                        className="body-left-item"
                                        style={{
                                            top: points[0][1] * 100 + '%',
                                            left: points[0][0] * 100 + '%',
                                            right: (1 - points[1][0]) * 100 + '%',
                                            bottom: (1 - points[1][1]) * 100 + '%',
                                            borderColor: selectedUrl === index ? '#ff8200' : (algStatus == 1 ? '#52c41a' : '#ff4d4f')
                                        }}
                                        onClick={() => {
                                            setSelectedUrl(index);
                                            setSelectedNum(0);
                                        }}
                                    />
                                )
                            })
                    }
                </div>
                <div
                    className={`body-right flex-box`}
                    style={{
                        backgroundImage: showImg ? `url(${showImg || ''}?timestamp=${new Date().getTime()})` : '',
                        width: '50%'
                    }}
                >
                    {
                        (selectedNum > 0) ?
                            <LeftCircleOutlined className="left-icon" onClick={() => setSelectedNum(prev => prev - 1)} />
                            :
                            <LeftCircleOutlined className="left-icon" style={{ color: 'gray', cursor: 'not-allowed' }} />
                    }
                    {
                        !!showImg ? null :
                            <div style={{ color: '#fff', fontSize: 16 }}>暂无结果图片</div>
                    }
                    {
                        (selectedNum < list?.localSrcList?.length - 1) ?
                            <RightCircleOutlined className="right-icon" onClick={() => setSelectedNum(prev => prev + 1)} />
                            :
                            <RightCircleOutlined className="right-icon" style={{ color: 'gray', cursor: 'not-allowed' }} />
                    }
                </div>
            </div>
        </Modal>
    )
}

export default ImgModal
