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
    qualified: 0,
    isAudited: 3,
});
const formatQuery = (query) => {
    const { timeRange = [], qualified, ...rest } = query;
    const orderBeginTime =
        timeRange[0] && moment(timeRange[0]).format("YYYY-MM-DD HH:mm:ss");
    const orderEndTime =
        timeRange[1] && moment(timeRange[1]).format("YYYY-MM-DD HH:mm:ss");
    let res = {
        ...rest,
        orderBeginTime,
        orderEndTime,
    };
    qualified && Object.assign(res, {
        orderStatus: qualified
    })
    return res
};
let preventNextQuery = false;

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
    const patchImg = (imageId, isAudited) => setImgList({
        ...imgList,
        list: imgList.list.map(i => i.imageId === imageId ? { ...i, isAudited } : i)
    })
    const unmount = () => {
        setReady(false)
        resetImgDrawer()
        resetOrderQuery()
        setOrderList(getInitialList())
    };

    // 列表
    const loadOrderList = async (query = {} as any) => {
        if (preventNextQuery) {
            preventNextQuery = false
            return
        }
        if (query.pageSize) {
            preventNextQuery = true
        }
        const { pageNum, pageSize } = orderList
        const res = await queryOrderList(
            formatQuery({
                ...orderQuery,
                pageNum,
                pageSize,
                ...query,
            })
        )
        if (res && res.code == 200) {
            setOrderList(res.result)
        } else {
            message.error('接口异常')
        }
    };
    // 查看历史
    const handleOrderDetail = async (orderNo: string) => {
        if (orderNo) {
            const res = await getOrderDetail(orderNo);
            if (res && res.code == 200) {
                setProcessResult(res.result);
            } else {
                message.error('接口异常')
            }
        }
    };
    const handleViewOrder = (order) => {
        setCurrentOrderId(order.orderNo)
        setImgDrawerVisible(true)
        // loadImgList()
    };
    // 图片列表
    const loadImgList = async (query = {} as any) => {
        const { pageNum, pageSize } = imgList
        const { isAudited, ...rest } = formatQuery({
            ...imgQuery,
            orderNo: currentOrderId,
            pageNum,
            pageSize,
            ...query,
        })
        let data = { ...rest }
        if (isAudited !== 3) {
            Object.assign(data, { isAudited });
        }
        const res = await queryImgList(data);
        if (res && res.code == 200) {
            setImgList(res.result);
        } else {
            message.error('接口异常')
        }
    };
    // 物料位置数据
    const loadMaterialList = async () => {
        const res = await getMaterialLocationList();
        if (res && res.code == 200) {
            setMaterialList(res.result);
        } else {
            message.error('接口异常')
        }
    };
    // 切换图片
    const loadSiblingImg = async (query = {}) => {
        const { isAudited, ...rest } = formatQuery({
            ...imgQuery,
            orderNo: currentOrderId,
            ...query,
        })
        let data = { ...rest }
        if (isAudited !== 3) {
            Object.assign(data, { isAudited })
        }
        const res = await getSiblingImg(Object.assign({}, data,));
        if (res && res.code == 200) {
            setImgViewerData(res.result);
        } else {
            message.error('接口异常')
        }
    };
    // 审核图片
    const handleAudit = async (audit) => {
        setImgViewerLoading(true);
        const res = await auditImg({
            audit,
            id: imgViewerData.imageId,
        });
        if (res && res.code == 200) {
            setImgViewerData(res.result);
        } else {
            message.error('接口异常')
        }
        setImgViewerLoading(false)
    }

    useEffect(() => {
        ready && loadOrderList({ pageNum: 1 })
    }, [ready, orderQuery])
    useEffect(() => {
        ready && imgDrawerVisible && loadImgList({ pageNum: 1, orderNo: currentOrderId, })
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
        patchImg, unmount, queryOrderList, queryImgList,
        handleAudit, loadSiblingImg, handleViewOrder,
        imgViewerVisible, imgViewerData, imgViewerLoading,
        setImgViewerVisible, setImgViewerData, setImgViewerLoading,
        handleOrderDetail, processResult, setProcessResult,
        loadMaterialList, materialList,
    }
};
