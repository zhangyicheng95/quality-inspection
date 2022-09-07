import { request } from 'umi';

const BASE_IP = localStorage.getItem("ipUrl-history") || 'localhost:8888';
// 历史数据
export const queryOrderList = params => request(`http://${BASE_IP}/track/order/list/v1`, { params });
export const queryImgList = params => request(`http://${BASE_IP}/track/pic/list/v1`, { params });
export const getSiblingImg = params => request(`http://${BASE_IP}/track/pic/next`, { params })
export const auditImg = data => request(
    `http://${BASE_IP}/track/pic`,
    { method: 'POST', data }
)

// 数据统计
export const staticsOrderList = params => request(`http://${BASE_IP}/track/statics/order`, { params });
export const staticsImgList = params => request(`http://${BASE_IP}/track/statics/img`, { params });
