import { queryOrderList, getOrderDetail, queryImgList, getSiblingImg, auditImg, getMaterialLocationList } from "@/services";
import { useEffect, useState } from 'react';
import { message } from 'antd';
import moment from "moment";

const getInitialList = () => ({
    pageNum: 1,
    total: 0,
    pageSize: 20,
    list: [],
});
const getInitialOrderQuery = () => ({
    orderNo: undefined,
    timeRange: [],
});
const getInitialImgQuery = () => ({
    id: undefined,
    timeRange: [],
    algStatus: 0,
    auditStatus: 0,
});
const formatQuery = (query) => {
    const { timeRange = [], orderStatus, algStatus, auditStatus, ...rest } = query;
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

export default () => {
    const [ready, setReady] = useState<boolean>(false)
    const [orderQuery, setOrderQuery] = useState<any>(getInitialOrderQuery())
    const [orderList, setOrderList] = useState<any>(getInitialList())

    const [currentOrderId, setCurrentOrderId] = useState<any>()
    const [imgDrawerVisible, setImgDrawerVisible] = useState<boolean>(false)
    const [imgQuery, setImgQuery] = useState<any>(getInitialImgQuery())
    const [imgList, setImgList] = useState<any>(getInitialList())
    const [processResult, setProcessResult] = useState<any>({});
    const [imgViewerLoading, setImgViewerLoading] = useState<boolean>(false);
    const [imgViewerData, setImgViewerData] = useState<any>({});
    const [imgViewerVisible, setImgViewerVisible] = useState<boolean>(false);
    const [materialList, setMaterialList] = useState<any>([]);

    const resetOrderQuery = () => setOrderQuery(getInitialOrderQuery())
    const resetImgQuery = () => setImgQuery(getInitialImgQuery())
    const resetImgDrawer = () => {
        setImgList(getInitialList())
        setImgQuery(getInitialImgQuery())
        setCurrentOrderId(undefined)
        setImgDrawerVisible(false)
    }
    const unmount = () => {
        setReady(false)
        resetImgDrawer()
        resetOrderQuery()
        setOrderList(getInitialList())
    };

    // 列表
    const loadOrderList = async (query = {} as any) => {
        const { pageNum, pageSize } = orderList;
        const { captureBeginTime, captureEndTime, ...rest } = formatQuery({
            ...orderQuery,
            pageNum: !!pageNum ? pageNum : 1,
            pageSize: !!pageSize ? pageSize : 20,
            ...query,
        })
        const res = await queryOrderList(rest)
        if (res) {
            setOrderList(res);
        }
    };
    // 物料位置数据
    const loadMaterialList = async (orderNo: string, materialId: string) => {
        setCurrentOrderId(orderNo);
        const res = await getMaterialLocationList({ materialId });

        if (res) {
            setMaterialList(res);
            handleOrderDetail(orderNo, !!res[0] ? res[0]?.id : '1')
        }
    };
    // 查看历史
    const handleOrderDetail = async (orderNo: string, lable) => {
        if (orderNo) {
            const res = await getOrderDetail({ orderNo, lable });
            if (res) {
                setProcessResult(res);
            } else {
                message.error(res?.message || '接口异常')
            }
        }
    };
    const handleViewOrder = (order) => {
        setCurrentOrderId(order.orderNo)
        setImgDrawerVisible(true)
        // loadImgList()
    };
    // 查看详情
    const loadImgList = async (query = {} as any, drawerVisible?: boolean) => {
        const { pageNum, pageSize } = imgList
        const { orderBeginTime, orderEndTime, ...rest } = formatQuery({
            ...imgQuery,
            orderNo: currentOrderId,
            pageNum: !!pageNum ? pageNum : 1,
            pageSize: !!pageSize ? pageSize : 20,
            ...query,
        })
        let data = { ...rest }
        const res = await queryImgList(data);
        if (drawerVisible && res.list?.length) {
            setImgViewerData(res.list[0])
            setImgViewerVisible(true)
        }
        if (res) {
            setImgList(res);
        }
    };
    // 切换图片
    const loadSiblingImg = async (query = {}) => {
        const { orderBeginTime, orderEndTime, ...rest } = formatQuery({
            ...imgQuery,
            orderNo: currentOrderId,
            ...query,
        })
        let data = { ...rest }
        const res = await getSiblingImg(Object.assign({}, data,));
        if (res) {
            setImgViewerData(res);
        }
    };
    // 审核图片
    const handleAudit = async (audit) => {
        setImgViewerLoading(true);
        const res = await auditImg({
            auditStatus: audit,
            id: imgViewerData.imageId,
        });
        if (res) {
            setImgViewerData(res);
        }
        setImgViewerLoading(false)
    }

    useEffect(() => {
        ready && loadOrderList({ pageNum: 1, pageSize: 20, })
    }, [ready, orderQuery])
    useEffect(() => {
        ready && imgDrawerVisible && loadImgList({ pageNum: 1, pageSize: 20, orderNo: currentOrderId, })
    }, [ready, imgDrawerVisible, imgQuery, currentOrderId])

    return {
        ready, setReady,
        orderQuery, setOrderQuery,
        orderList, setOrderList, loadOrderList,
        currentOrderId, setCurrentOrderId,
        imgDrawerVisible, setImgDrawerVisible,
        imgList, setImgList, loadImgList,
        imgQuery, setImgQuery,
        resetOrderQuery, resetImgQuery, resetImgDrawer,
        unmount, queryOrderList, queryImgList,
        handleAudit, loadSiblingImg, handleViewOrder,
        imgViewerVisible, imgViewerData, imgViewerLoading,
        setImgViewerVisible, setImgViewerData, setImgViewerLoading,
        handleOrderDetail, processResult, setProcessResult,
        loadMaterialList, materialList,
    }
};
