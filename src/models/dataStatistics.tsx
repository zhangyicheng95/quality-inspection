import { staticsOrderList, staticsImgList, queryImgList, getSiblingImg, auditImg, staticsDefectList } from "@/services";
import { useEffect, useState } from 'react';
import { message } from 'antd';

const moment = require("moment");
const getInitialList = () => ({
    pageNum: 1,
    total: 0,
    pageSize: 20,
    list: [],
});
const getInitialOrderQuery = (currentType = 'order') => ({
    currentType,
    timeRange: [moment(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), moment(new Date().getTime())],
});
const getInitialImgQuery = () => ({
    id: undefined,
    timeRange: [],
    algStatus: 0,
    auditStatus: 0,
});
const formatQuery = (query) => {
    const { timeRange = [], orderStatus, algStatus, auditStatus, ...rest } = query;
    const startTime =
        !!timeRange && timeRange[0] ? moment(timeRange[0]).format("YYYY-MM-DD HH:mm:ss") : undefined;
    const endTime =
        !!timeRange && timeRange[1] ? moment(timeRange[1]).format("YYYY-MM-DD HH:mm:ss") : undefined;
    const orderBeginTime =
        timeRange[0] && moment(timeRange[0]).format("YYYY-MM-DD HH:mm:ss");
    const orderEndTime =
        timeRange[1] && moment(timeRange[1]).format("YYYY-MM-DD HH:mm:ss");
    const captureBeginTime =
        timeRange[0] && moment(timeRange[0]).format("YYYY-MM-DD HH:mm:ss");
    const captureEndTime =
        timeRange[1] && moment(timeRange[1]).format("YYYY-MM-DD HH:mm:ss");
    let res = {
        ...rest,
        startTime,
        endTime,
        orderBeginTime,
        orderEndTime,
        captureBeginTime,
        captureEndTime
    };
    orderStatus && Object.assign(res, {
        orderStatus
    });
    algStatus && Object.assign(res, {
        algStatus
    });
    auditStatus && Object.assign(res, {
        auditStatus
    });
    return res
};
let preventNextQuery = false;

export default () => {
    const [ready, setReady] = useState<boolean>(false)
    const [orderQuery, setOrderQuery] = useState<any>(getInitialOrderQuery())
    const [orderList, setOrderList] = useState<any>({});

    const [currentOrderIdList, setCurrentOrderIdList] = useState<any>([]);
    const [currentOrderId, setCurrentOrderId] = useState<any>('');
    const [imgDrawerVisible, setImgDrawerVisible] = useState<boolean>(false);
    const [imgQuery, setImgQuery] = useState<any>(getInitialImgQuery());
    const [imgList, setImgList] = useState<any>(getInitialList());

    const [imgViewerLoading, setImgViewerLoading] = useState<boolean>(false);
    const [imgViewerData, setImgViewerData] = useState<any>({});
    const [imgViewerVisible, setImgViewerVisible] = useState<boolean>(false);

    const resetOrderQuery = (currentType: string) => setOrderQuery(getInitialOrderQuery(currentType));
    const resetImgQuery = () => setImgQuery(getInitialImgQuery());
    const resetImgDrawer = () => {
        setImgList(getInitialList());
        setImgQuery(getInitialImgQuery());
        setCurrentOrderId(undefined);
        setCurrentOrderIdList([]);
        setImgDrawerVisible(false);
    }
    const unmount = (currentType: string) => {
        setReady(false)
        resetImgDrawer()
        resetOrderQuery(currentType)
        setOrderList({})
    }
    // 图表数据
    const loadOrderList = () => {
        if (preventNextQuery) {
            preventNextQuery = false
            return
        }
        const { currentType, ...rest } = orderQuery;
        const { orderBeginTime, orderEndTime, captureBeginTime, captureEndTime, ...que } = formatQuery({
            ...rest,
        });
        if (currentType === 'order') {
            staticsOrderList(que).then((res) => {
                if (res) {
                    setOrderList(res);
                }
            });
        } else if (currentType === 'img') {
            staticsImgList(que).then((res) => {
                if (res) {
                    setOrderList(res);
                }
            });
        } else if (currentType === 'defect') {
            staticsDefectList(que).then((res) => {
                if (res) {
                    setOrderList(res);
                }
            });
        }
    }
    // 点击柱状图
    const handleViewOrder = (order) => {
        if (order?.orderNo && order?.orderNo[0]) {
            setCurrentOrderIdList(order?.orderNo || [])
            setCurrentOrderId(order?.orderNo[0])
        }
        setImgDrawerVisible(true)
        // loadImgList()
    }
    // 弹出抽屉，列表
    const loadImgList = async (query = {} as any) => {
        const { pageNum, pageSize } = imgList
        const { orderBeginTime, orderEndTime, startTime, endTime, ...rest } = formatQuery({
            ...imgQuery,
            // orderNo: currentOrderId,
            pageNum,
            pageSize,
            ...query,
        })
        let data = { ...rest }
        const res = await queryImgList(data);
        if (res) {
            res && setImgList(res);
        }
    }
    // 切换图片
    const loadSiblingImg = async (query = {}) => {
        const { orderBeginTime, orderEndTime, startTime, endTime, ...rest } = formatQuery({
            ...imgQuery,
            orderNo: currentOrderId,
            ...query,
        })
        let data = { ...rest }
        const res = await getSiblingImg(data)
        if (res) {
            setImgViewerData(res);
        }
    }
    // 审核图片
    const handleAudit = async (audit) => {
        setImgViewerLoading(true)
        const res = await auditImg({
            auditStatus: audit,
            id: imgViewerData.imageId,
        });
        if (res) {
            setImgViewerData(res)
        }
        setImgViewerLoading(false)
    }

    useEffect(() => {
        ready && loadOrderList();
    }, [ready, orderQuery]);

    useEffect(() => {
        imgDrawerVisible && loadImgList({
            pageNum: 1,
            pageSize: 20
            //  orderNo: currentOrderId, 
        })
    }, [ready, imgDrawerVisible, imgQuery, currentOrderId]);

    return {
        ready, setReady,
        orderQuery, setOrderQuery,
        orderList, setOrderList, loadOrderList,
        currentOrderIdList, setCurrentOrderIdList,
        currentOrderId, setCurrentOrderId,
        imgDrawerVisible, setImgDrawerVisible,
        imgList, setImgList, loadImgList,
        imgQuery, setImgQuery,
        resetOrderQuery, resetImgQuery, resetImgDrawer,
        unmount, staticsOrderList, queryImgList,
        handleAudit, loadSiblingImg, handleViewOrder,
        imgViewerVisible, imgViewerData, imgViewerLoading,
        setImgViewerVisible, setImgViewerData, setImgViewerLoading
    }
};
