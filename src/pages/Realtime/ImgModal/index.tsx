import './index.less';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import * as _ from 'lodash';

interface Props {
    data: any;
    onOk?: any;
    onCancel: any;
}

const ImgModal: React.FC<Props> = (props) => {
    const { data = {}, onCancel, } = props;
    const { globalSrcPath = '', boundingBoxes = [], label, backImgType, } = data;
    // @ts-ignore
    const systemType = window?.QUALITY_CONFIG?.type;
    const [selectedUrl, setSelectedUrl] = useState(0);
    const [selectedNum, setSelectedNum] = useState(0);

    const list = useMemo(() => {
        return (!!label ? boundingBoxes.filter(i => i.label == label) : boundingBoxes).filter(i => {
            if ((systemType === 'jbt' || systemType === 'tbg') && backImgType != i?.pointsType[0]) {
                return null;
            }
            return i;
        }).filter(Boolean);
    }, [label, boundingBoxes, systemType, backImgType])

    const showImg = useMemo(() => {
        if (systemType === 'jbt' || systemType === 'tbg') {
            const parent = list[selectedUrl]?.localSrcImages?.filter(i => i.type == backImgType);
            console.log(parent, selectedNum);
            return !!parent && parent?.length && parent[selectedNum]?.imgUrl;
        }
        return list[selectedUrl]?.localSrcList[selectedNum];
    }, [label, boundingBoxes, selectedUrl, selectedNum, backImgType, systemType]);

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
            title={"预览结果"}
            width="100vw"
            centered
            // onOk={() => { }}
            footer={null}
            onCancel={() => {
                onCancel();
            }}
        >
            <div className={`page-history-img-modal-body ${systemType === 'ym' ? '' : 'flex-box'}`}>
                <div
                    className={systemType === 'ym' ? 'body-top' : "body-left"}
                    style={{
                        backgroundImage: `url(${globalSrcPath || ''})`,
                        backgroundSize: systemType === 'tbg' ? 'auto 100%' : '100% 100%',
                        width: systemType === 'ym' ? '100%' : (systemType === 'jbt' || systemType === 'tbg') ? '40%' : '20%'
                    }}
                >
                    {
                        (list || []).map(
                            (item: any, index: number) => {
                                const { points, pointsType } = item;
                                if ((systemType === 'jbt' || systemType === 'tbg') && backImgType != pointsType[0]) {
                                    return null;
                                }
                                return (
                                    <div
                                        key={index}
                                        className="body-left-item"
                                        style={!!label ? {
                                            top: `calc(${points[0][1] * 100}% - 10px)`,
                                            left: `calc(${points[0][0] * 100}% - 10px)`,
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            borderColor: selectedUrl === index ? '#ff8200' : 'red'
                                        } : {
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
                    className={`${systemType === 'ym' ? 'body-bottom' : 'body-right'} flex-box`}
                    style={{
                        backgroundImage: `url(${showImg || ''})`,
                        width: systemType === 'ym' ? '100%' : (systemType === 'jbt' || systemType === 'tbg') ? '60%' : '80%'
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
                        (selectedNum < (!!label ? boundingBoxes.filter(i => i.label == label) : boundingBoxes)[selectedUrl]?.localSrcList.length - 1) ?
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
