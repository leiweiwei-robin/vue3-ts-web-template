// import { showToast } from 'vant';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/storage-keys';
import { logout } from './login-out';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

let responseQueue: {
  service: AxiosInstance;
  config: AxiosRequestConfig;
  resolve: (value: AxiosResponse) => void;
  reject: (value: AxiosResponse) => void;
}[] = [];
let requestQueue: any[] = [];
let refreshing = false;

const shouldSkiped = new WeakSet();

function useRefreshToken(service: AxiosInstance) {
  // 拦截并记录刷新jwt期间发起的所有请求
  service.interceptors.request.use(
    async (config: InternalAxiosRequestConfig & { __should_skiped?: boolean }) => {
      if (refreshing && !config.__should_skiped) {
        await new Promise(resolve => requestQueue.push(resolve));
      }
      if (config.__should_skiped) {
        delete config.__should_skiped;
      }
      return config;
    },
  );

  // 捕获所有jwt过期错误的响应, 刷新jwt后重放请求
  service.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401 || error.response?.data?.code === 401) {
        if (!refreshing) refreshJWT(service).then(retryRequest, onRefreshFail);
        return new Promise((resolve, reject) => {
          responseQueue.push({
            service,
            config: error.config,
            resolve,
            reject,
          });
        });
      }
      return Promise.reject(error);
    },
  );

  return shouldSkiped;
}

async function refreshJWT(service: AxiosInstance) {
  refreshing = true;
  const refreshConfig = {
    url: '/elan/v2/user/token/refresh',
    method: 'POST',
    __should_skiped: true,
    data: {
      refresh_token: localStorage.getItem('refreshToken'),
    },
  };
  const res = await service(refreshConfig).catch(err => {
    throw err;
  });
  if (!res.data.jwt) {
    console.error('登录失效，转跳登录页', res);
    // showToast({
    //   message: '登录失效，转跳登录页',
    //   position: 'top'
    // });
    refreshing = false;
    logout();
    return;
  }

  localStorage.setItem(ACCESS_TOKEN, res.data.jwt.access_token);
  if (res.data.jwt.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN, res.data.jwt.refresh_token);
  }
  refreshing = false;
}

function retryRequest() {
  responseQueue.reverse();
  while (responseQueue.length) {
    // prettier-ignore
    const { service, config, resolve, reject } = responseQueue.pop()!;
    service(config).then(response => {
      // response已经执行完拦截器逻辑, 标识跳过service后续重复拦截器, 透传给接口handler
      shouldSkiped.add(response);
      resolve(response);
    }, reject);
  }
  requestQueue.reverse();
  while (requestQueue.length) {
    requestQueue.pop()?.(true);
  }
}

function onRefreshFail(err: any) {
  responseQueue[0].reject(err);
  // 抛弃捕获的请求和响应
  responseQueue = [];
  requestQueue = [];
  refreshing = false;
}

export default useRefreshToken;
