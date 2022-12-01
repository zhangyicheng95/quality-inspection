import './index.less';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Button } from 'antd';
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
        materialList,
    } = useModel('history' as any);
    const { data = {}, onCancel, } = props;
    const { globalSrcPath = '', boundingBoxes = [], } = data;
    const [selectedUrl, setSelectedUrl] = useState(0);
    const [selectedNum, setSelectedNum] = useState(0);
    const [carType, setCarType] = useState(1);
    const [backImgType, setBackImgType] = useState(2);

    const list = useMemo(() => {
        return boundingBoxes.filter(i => i.labal == carType && i.type == backImgType);
    }, [carType, boundingBoxes, backImgType]);

    const showImg = useMemo(() => {
        const parent = list[selectedUrl]?.localSrcList;
        return !!parent && parent?.length && parent[selectedNum];
    }, [list, selectedUrl, selectedNum]);

    useEffect(() => {
        // const img = new Image();
        // img.src = globalSrcPath;
        // img.onload = (res) => {
        // const { width, height } = img;
        // console.log(35, width, height);
        // };
    }, [globalSrcPath]);

    return (
        <Modal
            className='page-history-img-modal'
            visible={true}
            title={<div className="flex-box" style={{ gap: 16 }}>
                <div style={{ marginRight: 24 }}>预览结果</div>
                {
                    (materialList || []).map((car: any, index: number) => {
                        const { id, cname } = car;
                        return <Button key={id} type={carType === id ? "primary" : "default"} onClick={() => setCarType(id)}>
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
            </div>}
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
                        backgroundImage: `url(${globalSrcPath || ''}?timestamp=${new Date().getTime()})`,
                        backgroundSize: 'auto 100%',
                        width: '40%'
                    }}
                >
                    {
                        (list || []).map(
                            (item: any, index: number) => {
                                const { points, type } = item;
                                if (backImgType != type) {
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
                                            borderColor: selectedUrl === index ? '#ff8200' : 'red'
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
                        backgroundImage: `url(${showImg || ''}?timestamp=${new Date().getTime()})`,
                        width: '60%'
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
