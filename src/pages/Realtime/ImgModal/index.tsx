import './index.less';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import { Form, Radio, DatePicker, Drawer, InputNumber, Table, Row, Col, Button, Modal } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import * as _ from 'lodash';

interface Props {
    data: any;
    onOk?: any;
    onCancel: any;
}

const ImgModal: React.FC<Props> = (props) => {
    const { data = {}, onCancel, } = props;
    const {
        processResult
    } = useModel('history' as any);
    const { globalSrcPath = '', boundingBoxes = [], } = !_.isEmpty(data) ? data : processResult;

    const [selectedUrl, setSelectedUrl] = useState(0);
    const [selectedNum, setSelectedNum] = useState(0);

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
            <div className="page-history-img-modal-body ">
                <div
                    className="body-left"
                    style={{ backgroundImage: `url(${globalSrcPath || ''})` }}
                >
                    {
                        (boundingBoxes || []).map((item: any, index: number) => {
                            const { points, } = item;
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
                    className="body-right flex-box"
                    style={{ backgroundImage: `url(${boundingBoxes[selectedUrl]?.localSrcList[selectedNum] || ''})` }}
                >
                    {
                        (selectedNum > 0) ?
                            <LeftCircleOutlined className="left-icon" onClick={() => setSelectedNum(prev => prev - 1)} />
                            :
                            <LeftCircleOutlined className="left-icon" style={{ color: 'gray', cursor: 'not-allowed' }} />
                    }
                    {
                        (selectedNum < boundingBoxes[selectedUrl]?.localSrcList.length - 1) ?
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
