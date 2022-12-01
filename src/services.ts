import { request } from 'umi';
const { origin, pathname = '/', href } = window.location;
const BASE_IP = (href.indexOf('iframe') > -1 || pathname !== '/') ? `${origin + pathname}` :
    `http://${localStorage.getItem("ipUrl-history")}${pathname}` || `http://localhost:19820${pathname}`;

/**
 *  历史数据
 * */
// 列表
export const queryOrderList = params => request(`${BASE_IP}track/order/list/v1`, { method: 'POST', params });
// 查看历史
export const getOrderDetail = orderNo => request(`${BASE_IP}track/order/post/detail?orderNo=${orderNo}`, { method: 'GET', });
// 获取物料位置数据
export const getMaterialLocationList = () => request(`${BASE_IP}materialLocation/list`, { method: 'GET' });
// 图片列表
export const queryImgList = params => request(`${BASE_IP}track/pic/list/v1`, { method: 'POST', params });
// 切换图片
export const getSiblingImg = params => request(`${BASE_IP}track/pic/next/v1`, { method: 'POST', params });
// 审核图片
export const auditImg = params => {
    const { id, audit } = params;
    return request(`${BASE_IP}track/audit/v1?id=${id}&auditStatus=${audit}`, { method: 'GET', params })
};

/**
 * 数据统计
 * */
// 订单纬度
export const staticsOrderList = params => request(`${BASE_IP}track/statics/order`, { method: 'GET', params });
// 图片维度
export const staticsImgList = params => request(`${BASE_IP}track/statics/img`, { method: 'GET', params });
// 焊缝维度
export const staticsLabelList = params => request(`${BASE_IP}track/statics/label`, { method: 'GET', params });
