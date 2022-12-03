import { request } from 'umi';
const { origin, pathname = '/', href } = window.location;
const BASE_IP = (href.indexOf('iframe') > -1 || pathname !== '/') ? `${origin + pathname}` :
    `http://${localStorage.getItem("ipUrl-history")}${pathname}` || `http://localhost:19820${pathname}`;

/**
 *  历史数据
 **/
// 列表
export const queryOrderList = data => request(`${BASE_IP}track/order/list/v1`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, data });
// 查看历史
export const getOrderDetail = params => request(`${BASE_IP}track/order/post/detail`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, params });
// 获取物料位置数据
export const getMaterialLocationList = () => request(`${BASE_IP}track/materialLocation/list?timestamp=${new Date().getTime()}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, });
// 图片列表
export const queryImgList = data => request(`${BASE_IP}track/pic/list/v1`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, data });
// 切换图片
export const getSiblingImg = data => request(`${BASE_IP}track/pic/next/v1`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, data });
// 审核图片
export const auditImg = params => request(`${BASE_IP}track/audit/v1`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, params });

/**
 * 数据统计
 **/
// 订单纬度
export const staticsOrderList = params => request(`${BASE_IP}track/statics/order`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, params });
// 图片维度
export const staticsImgList = params => request(`${BASE_IP}track/statics/img`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, params });
// 焊缝维度
export const staticsLabelList = params => request(`${BASE_IP}track/statics/label`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, params });
