import Request from 'uview-ui/libs/luch-request';
import $store from '@/store';
import base_url, { isDev } from './config';

const STATUS_MAP = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '请求地址不存在。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护中。',
  504: '网关超时。',
};

const BASE_API = base_url;

const pending = [];
function addPending(url, method) {
  let completeUrl = url.startsWith('http') ? url : BASE_API + url;
  completeUrl += (`&${method.toUpperCase()}`);
  if (!pending.includes(completeUrl)) {
    pending.push(completeUrl);
  }
}
function removePending(url, method) {
  let completeUrl = url.startsWith('http') ? url : BASE_API + url;
  completeUrl += (`&${method.toUpperCase()}`);
  if (pending.includes(completeUrl)) {
    const index = pending.indexOf(completeUrl);
    pending.splice(index, 1);
  }
}
function isPending(url, method) {
  let completeUrl = url.startsWith('http') ? url : BASE_API + url;
  completeUrl += (`&${method.toUpperCase()}`);
  return pending.includes(completeUrl);
}

function onToastClose(status) {
  if (status && /^401|425|429$/.test(status)) { // 401 425 429
    $store.dispatch('user/Logout').then(() => {
      if (!isDev) {
        // 跳转到登录页面
        uni.reLaunch({ url: '/pages/index/index' });
      }
    });
  }
}

// -3000 无权限
function authorizationInvalidate(status, message) {
  if (status == -3000) {
    uni.$emit('toastShow', {
      type: 'error',
      icon: false,
      duration: 2000,
      message: '连接超时，重新连接中',
      complete: () => {
        $store.dispatch('user/Logout').then(() => {
          if (!isDev) {
            // 跳转到登录页面
            uni.reLaunch({ url: '/pages/index/index' });
          }
        });
      },
    });
  } else {
    uni.$emit('toastShow', {
      type: 'error',
      icon: false,
      duration: 2000,
      message: message || '请求数据失败',
    });
  }
}

export class HttpRequest {
  constructor() {
    this.timeout = 120 * 1000;
  }

  static setInterceptors(instance, url, method) {
    instance.interceptors.request.use((config) => {
      const conf = config || {};
      if (!conf.baseURL) {
        conf.baseURL = BASE_API;
      }
      const { authorization, isBearerAuth } = conf.custom || {};
      if (!conf.header || !conf.header.Accept) {
        conf.header = { Accept: 'application/json, text/plain, */*' };
      }
      const token = $store.getters.token;
      if (authorization && token) {
        conf.header.Authorization = isBearerAuth ? `Bearer ${token}` : token;
      }
      return conf;
    }, (err) => {
      removePending(url, method);
      return Promise.reject(err);
    });

    instance.interceptors.response.use((res) => {
      removePending(url, method);
      const { statusCode, data, errMsg } = res;
      if (!data) {
        return Promise.reject({ status: statusCode, message: errMsg, errMsg });
      }
      if (/^[2-3]0\d$/.test(statusCode) && data.status > 0) {
        return Promise.resolve(data);
      }
      authorizationInvalidate(data.status, (data.message || errMsg));
      return Promise.reject(data);
    }, (err) => {
      console.warn('request-error', err);
      removePending(url, method);
      const { statusCode, data, errMsg } = err;
      let retMsg = errMsg;
      if (data && (data.message)) {
        retMsg = data.message;
      } else if (Object.hasOwnProperty.call(STATUS_MAP, statusCode)) {
        retMsg = STATUS_MAP[statusCode];
      }
      uni.$emit('toastShow', {
        type: 'error',
        icon: false,
        duration: 2000,
        message: retMsg,
        complete: () => onToastClose(statusCode),
      });
      return Promise.reject({ status: statusCode, message: retMsg });
    });
  }

  mergeOptions(options) {
    const opts = options;
    const {
      baseURL,
      dataType,
      header,
      method,
      params,
      data,
      responseType,
      timeout,
      url,
      ...custom
    } = opts;
    const { isBearerAuth } = custom;
    custom.isBearerAuth = !!isBearerAuth;
    return {
      // withCredentials: true,
      baseURL: baseURL || BASE_API,
      dataType,
      header,
      method,
      params,
      data,
      responseType,
      timeout: timeout || this.timeout,
      url,
      custom: { ...custom },
    };
  }

  request(options) {
    const { url, method } = options;
    addPending(url, method);
    const instance = new Request();
    HttpRequest.setInterceptors(instance, url, method);
    const opts = this.mergeOptions(options);
    return instance.request(opts);
  }

  get(config) {
    const { url, data, ...opts } = config;
    if (!url) {
      return Promise.reject();
    }
    const force = opts.force || false; // 强制请求，可以重复提交
    if (!force && isPending(url, 'get')) {
      return Promise.reject(`${url} is pending`);
    }
    delete opts.force;
    return this.request({
      method: 'get',
      url,
      data,
      ...opts,
    });
  }

  post(config) {
    const { url, data, ...opts } = config;
    if (!url) {
      return Promise.reject();
    }
    const force = opts.force || false; // 强制请求，可以重复提交
    if (!force && isPending(url, 'post')) {
      return Promise.reject(`${url} is pending`);
    }
    delete opts.force;
    return this.request({
      method: 'post',
      url,
      data,
      ...opts,
    });
  }

  put(config) {
    const { url, data, ...opts } = config;
    if (!url) {
      return Promise.reject();
    }
    const force = opts.force || false; // 强制请求，可以重复提交
    if (!force && isPending(url, 'put')) {
      return Promise.reject(`${url} is pending`);
    }
    delete opts.force;
    return this.request({
      method: 'put',
      url,
      data,
      ...opts,
    });
  }

  delete(config) {
    const { url, data, ...opts } = config;
    if (!url) {
      return Promise.reject();
    }
    const force = opts.force || false; // 强制请求，可以重复提交
    if (!force && isPending(url, 'delete')) {
      return Promise.reject(`${url} is pending`);
    }
    delete opts.force;
    return this.request({
      method: 'delete',
      url,
      data,
      ...opts,
    });
  }

}

export default new HttpRequest();
