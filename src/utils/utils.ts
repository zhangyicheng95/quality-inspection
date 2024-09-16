import { message } from "antd";
import * as _ from 'lodash';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const random = {
    key: (num = -1): string => `${Math.random()}`.slice(2, num),
    pick: (arr: any[]) => arr[Math.floor(Math.random() * arr.length)],
    multiple: (arr: any[]) => {
        const times = Math.floor(Math.random() * arr.length);
        const res = [];
        for (let i = 0; i < times; i += 1) {
            res.push(random.pick(arr))
        }
        return res
    }
};

export const set = (state, {keys = [], payload}) => {
    if (keys.length) {
        const [curKey, ...restKeys] = keys;
        return {
            ...state,
            [curKey]: set(state[curKey], {keys: restKeys, payload})
        }
    }
    return {
        ...state,
        ...payload
    }
}

export const delay = async (time = 300) => {
    await new Promise(resolve => setTimeout(resolve, time))
}

export interface IObjMap {
    [propName: number | string]: boolean;
};

export const arr2obj = (arr: (string | any)[], key?: string): IObjMap => {
    return arr.reduce((pre, cur) => ({
        ...pre,
        [key ? cur[key] : cur ]: true,
    }), {})
}

export const arr2enum = (arr: any[], valueKey = 'id', labelKey = 'name'): IValueEnum => {
    return arr.reduce((pre, cur) => ({
        ...pre,
        [cur[valueKey]]: cur[labelKey]
    }), {})
}

export const enum2values = (obj): any[] => Object.keys(obj)

export const options2enum = (arr: IOption[]) => arr2enum(arr, "value", "label")

export function titleCase(s) {
    return s.toLowerCase().replace(/\b([\w|‘]+)\b/g, (word) => {
        return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
    });
}

export function copy2clipbord (str: string) {
    const input = document.createElement('input');
	document.body.appendChild(input);
 	input.setAttribute('value', str);
	input.select();
	const res = document.execCommand('copy')
    res && message.success('文本复制到剪切板成功!')
    document.body.removeChild(input);
}
/**
 * 公共导出方法，支持ie10
 * @param data
 * @param name
 */
export function downFileFun(data = '{}', name = '') {
  const blob = new Blob([data], { type: 'application/x-sql;charset=UTF-8' });
  // @ts-ignore
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // @ts-ignore
    window.navigator.msSaveOrOpenBlob(blob, name);
  } else {
    const a = document.createElement('a');
    a.download = name;
    a.style.display = 'none';
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/**
 *  深度比较两个对象是否相同
 * @param {Object} oldData
 * @param {Object} newData
 */
 export function equalsObj(oldData: any, newData: any) {
    try {
      // 类型为基本类型时,如果相同,则返回true
      if (oldData === newData) return true;
      if (
        _.isObject(oldData) &&
        _.isObject(newData) &&
        Object.keys(oldData).length === Object.keys(newData).length
      ) {
        // 类型为对象并且元素个数相同
        // 遍历所有对象中所有属性,判断元素是否相同
        for (const key in oldData) {
          if (oldData?.hasOwnProperty(key)) {
            if (!equalsObj(oldData[key], newData[key])) {
              // 对象中具有不相同属性 返回false
              return false;
            }
          }
        }
      } else if (_.isArray(oldData) && oldData.length === newData.length) {
        // 类型为数组并且数组长度相同
        for (let i = 0, { length } = oldData; i < length; i++) {
          if (!equalsObj(oldData[i], newData[i])) {
            // 如果数组元素中具有不相同元素,返回false
            return false;
          }
        }
      } else {
        // 其它类型,均返回false
        return false;
      }
  
      // 走到这里,说明数组或者对象中所有元素都相同,返回true
      return true;
    } catch (err) {
      return false;
    }
  }
// 生成唯一id,8位数
export const guid = () => {
    return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };