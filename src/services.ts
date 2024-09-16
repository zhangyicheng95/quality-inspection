import { request } from 'umi';
import * as _ from 'lodash';
const { origin, pathname = '/', href } = window.location;
const BASE_IP = (href.indexOf('iframe') > -1 || pathname !== '/') ? `${origin + pathname}` :
    `http://${localStorage.getItem("ipUrl-history")}${pathname}` || `http://localhost:19820${pathname}`;

export async function btnFetch(type: string, url: string, params = {}, options?: any) {
    if (url?.indexOf('/') === 0) {
        url = url.slice(1);
    }
    if (url?.indexOf(':') < 0) {
        url = BASE_IP + url;
    }
    if (url?.indexOf('http') < 0) {
        url = 'http://' + url;
    }
    if (type === 'get') {
        if (_.isObject(params)) {
            return fetchGet(`${url}?${parseParamsToUrl(params)}`, { ...options });
        }
        if (_.isString(params)) {
            return fetchGet(`${url}/${params}`);
        }
        return fetchGet(url);
    }
    if (type === 'delete') {
        if (_.isObject(params)) {
            return fetchDelete(url, { params, ...options });
        }
        if (!_.isUndefined(params) && !_.isNull(params) && !!params) {
            return fetchDelete(`${url}/${params}`);
        }
        return fetchDelete(url);
    } else if (type === 'post') {
        if (_.isObject(params)) {
            return fetchPost(url, {
                body:
                    options?.headers['Content-Type'] === 'application/x-www-form-urlencoded'
                        ? parseParamsToUrl(params)
                        : params,
                ...options,
            });
        }
        if (!_.isUndefined(params) && !_.isNull(params) && !!params) {
            return fetchPost(`${url}/${params}`);
        }
        return fetchPost(url);
    } else if (type === 'put') {
        if (_.isObject(params)) {
            return fetchPut(url, { body: params, ...options });
        }
        if (!_.isUndefined(params) && !_.isNull(params) && !!params) {
            return fetchPut(`${url}/${params}`);
        }
        return fetchPut(url);
    } else if (type === 'upload') {
        if (_.isObject(params)) {
            return upload(url, { body: params, ...options });
        }
    }
}
// 历史数据
export const queryOrderList = params => request(`${BASE_IP}track/order/list/v1`, { params });
export const getOrderDetail = orderId => request(`${BASE_IP}track/order/post/detail?orderId=${orderId}`, { method: 'POST', });
export const queryImgList = params => request(`${BASE_IP}track/pic/list/v1`, { params });
export const getSiblingImg = params => request(`${BASE_IP}track/pic/next`, { params });
export const auditImg = data => request(`${BASE_IP}track/pic`, { method: 'POST', data });

// 数据统计
// 订单纬度
export const staticsOrderList = params => request(`${BASE_IP}track/statics/order`, { params });
// 图片维度
export const staticsImgList = params => request(`${BASE_IP}track/statics/img`, { params });
// 缺陷数据字典
export const getDefectList = () => request(`${BASE_IP}track/defect/list?timestamp=${new Date().getTime()}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, });
// 焊缝/缺陷维度
export const staticsLabelList = params => request(`${BASE_IP}track/statics/label`, { params });
