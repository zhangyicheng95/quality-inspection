import './index.less'
import React, { Fragment, useEffect, useState } from 'react'
import { useModel, history, useHistory, useLocation } from 'umi'
import { Table, Button } from 'antd'
import PanelTitle from '@/components/PanelTitle'
import ImgViewer from '@/components/ImgViewer'
import useResize from '@/hooks/useResize'
import moment from 'moment'
import { isEmpty, isObject } from 'lodash'
import ImgModal from './ImgModal'

const format = (time) => moment(time).format("YYYY-MM-DD HH:mm:ss");
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

const Realtime = () => {
  const {
    init, removeInit, result, processResult, processResultTimes, setProcessResultTimes,
    orderCount, exceptionOrderCount } = useModel('realtime' as any);
  const [current1, setCurrent1] = useState<any>({});
  const { height } = useResize();
  const [curHeight, setCurHeight] = useState<number>(height);
  const [imgViewerData, setImgViewerData] = useState<any>({});
  const [imgViewerVisible, setImgViewerVisible] = useState<boolean>(false);
  const [imgModalData, setImgModalData] = useState<any>({});

  useEffect(() => {
    init();

    return () => {
      removeInit();
    }
  }, []);
  useEffect(() => {
    setCurrent1(result[0] || {});
  }, [result]);
  useEffect(() => {
    if (!isEmpty(processResult)) {
      if (processResultTimes === 0) {
        setImgModalData(processResult);
        setProcessResultTimes(1);
      }
    } else {
      setImgModalData({});
      setProcessResultTimes(1);
    }
  }, [processResult, processResultTimes]);
  useEffect(() => {
    setCurHeight(Math.max(height, 700))
  }, [height]);

  const viewOrder = orderId => () => history.push(`/history?orderId=${orderId}`)
  const viewImg = (orderId, id) => () => history.push(`/history?orderId=${orderId}&id=${id}`)
  const handleViewImg = record => () => {
    setImgViewerData(record)
    setImgViewerVisible(true)
  }

  const columns = [
    { key: 'index', dataIndex: 'index', title: '序号', width: 50, align: 'center' },
    {
      key: 'orderId', dataIndex: 'orderId', title: '订单号',
      render: (orderId) => <Button type="text" onClick={viewOrder(orderId)}>{orderId}</Button>
    },
    {
      key: 'id', dataIndex: 'id', title: '图片序号', width: 75,
      render: (id, { orderId }) => <Button type="text" onClick={viewImg(orderId, id)}>{id}</Button>
    },
    {
      key: 'time', dataIndex: 'time', title: '图片时间', width: 150,
      render: time => format(time)
    },
    {
      key: 'result', dataIndex: 'result', title: '检测结果', width: 75,
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
      key: 'view', dataIndex: 'view', title: '图片详情', width: 85,
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
    <div className="page-realtime">
      <div className="panel left-panel" style={{ width: curHeight - 210 }}>
        <PanelTitle>实时结果</PanelTitle>
        <div className="panel-content">
          {current1.imageUrl && <div
            className='img'
            style={{ backgroundImage: `url(${current1.imageUrl})` }}
            onClick={handleViewImg(current1)}
          />}
          {
            current1.id &&
            <Fragment>
              <div className="current-img-info">
                <span className="field" style={{ marginRight: 20 }}>{format(current1.time)}</span>
                <span className="field">订单号:&nbsp;{current1.orderId || ''}</span>
                <span className="field">图片序号:&nbsp;{current1.id || ''}</span>
                <span className="field">图片名称:&nbsp;{current1?.imageUrl?.split('track-inspect/')[1] || ''}</span>
              </div>
              {
                isObject(processResult) && !isEmpty(processResult) ?
                  <div className={`show-img-result`} onClick={() => setImgModalData(processResult)}>
                    预览结果
                  </div>
                  : null
              }
              <div className={`current-img-result ${current1.result > 0 ? '' : 'error'}`}>
                {LABEL_RESULT[current1.result]}
              </div>
            </Fragment>
          }
        </div>
      </div>
      <div className="panel right-panel">
        <PanelTitle>当日统计</PanelTitle>
        <div className="stat-detail">
          <div className="field total">
            <div>
              <div className="icon icon-order" />
              <div className="field-name">订单数量</div>
            </div>
            <div className="field-value">{orderCount || 0}</div>
          </div>
          <div className="field error">
            <div>
              <div className="icon icon-error" />
              <div className="field-name">异常订单数量</div>
            </div>
            <div className="field-value">{exceptionOrderCount || 0}</div>
          </div>
        </div>
        <Table
          columns={columns as any}
          dataSource={result.map((i, index) => ({
            ...i,
            index: index + 1
          }))}
          key="index"
          pagination={false}
          scroll={{ y: curHeight - 348 }}
        />
      </div>
      {imgViewerVisible && <ImgViewer
        data={imgViewerData}
        onClose={() => {
          setImgViewerVisible(false)
          setImgViewerData({})
        }}
      />}

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

export default Realtime
