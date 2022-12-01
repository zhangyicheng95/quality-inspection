import { staticsOrderList, staticsImgList, queryImgList, getSiblingImg, auditImg, staticsLabelList } from "@/services";
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
    qualified: 0,
    isAudited: 3,
});
const formatQuery = (query) => {
    const { timeRange = [], qualified, ...rest } = query;
    const startTime =
        !!timeRange && timeRange[0] ? moment(timeRange[0]).format("YYYY-MM-DD HH:mm:ss") : undefined;
    const endTime =
        !!timeRange && timeRange[1] ? moment(timeRange[1]).format("YYYY-MM-DD HH:mm:ss") : undefined;
    let res = {
        ...rest,
        startTime,
        endTime,
    };
    qualified && Object.assign(res, {
        qualified: qualified === 1
    })
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
    const patchImg = (id, isAudited) => setImgList({
        ...imgList,
        list: imgList.list.map(i => i.id === id ? { ...i, isAudited } : i)
    })
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
        if (currentType === 'order') {
            staticsOrderList(
                formatQuery({
                    ...rest,
                })
            ).then((res) => {
                if (res && res.code == 200) {
                    setOrderList(res);
                } else {
                    message.error(res?.message || '接口异常');
                }
            });
        } else if (currentType === 'img') {
            staticsImgList(
                formatQuery({
                    ...rest,
                })
            ).then((res) => {
                if (res && res.code == 200) {
                    setOrderList(res);
                } else {
                    message.error(res?.message || '接口异常');
                }
            });
        } else if (currentType === 'label') {
            staticsLabelList(
                formatQuery({
                    ...rest,
                })
            ).then((res) => {
                if (res && res.code == 200) {
                    setOrderList(res);
                } else {
                    message.error(res?.message || '接口异常');
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
        const { isAudited, ...rest } = formatQuery({
            ...imgQuery,
            // orderNo: currentOrderId,
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
            res && setImgList(res);
        } else {
            message.error('接口异常')
        }
    }
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
        const res = await getSiblingImg(data)
        if (res && res.code == 200) {
            setImgViewerData(res);
        } else {
            message.error('接口异常')
        }
    }
    // 审核图片
    const handleAudit = async (audit) => {
        setImgViewerLoading(true)
        const res = await auditImg({
            audit,
            id: imgViewerData.id,
        });
        if (res && res.code == 200) {
            setImgViewerData(res)
        } else {
            message.error('接口异常')
        }
        setImgViewerLoading(false)
    }

    useEffect(() => {
        ready && loadOrderList();
    }, [ready, orderQuery]);

    useEffect(() => {
        imgDrawerVisible && loadImgList({
            pageNum: 1,
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
        patchImg, unmount, staticsOrderList, queryImgList,
        handleAudit, loadSiblingImg, handleViewOrder,
        imgViewerVisible, imgViewerData, imgViewerLoading,
        setImgViewerVisible, setImgViewerData, setImgViewerLoading
    }
};
