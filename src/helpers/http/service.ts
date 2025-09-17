import { message } from 'ant-design-vue';
import Axios from 'axios';
import { ACCESS_TOKEN } from '@/constants/storage-keys';
import router from '@/router';
import type { ErrorEnumKey } from './error_enum';
import { ErrorEnum } from './error_enum';
import { logout } from './login-out';
// import { showToast } from 'vant'
import useRefreshToken from './use-refresh-token';

const service = Axios.create({
  method: 'post',
  baseURL: '/',
});

service.interceptors.request.use(config => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  const {resourceCode} = router.currentRoute.value.meta;
  if (resourceCode) {
    config.headers.ResourceCode = resourceCode;
  }
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    config.headers.UserId = JSON.parse(userInfo).id;
  }
  return config;
});

const shouldSkiped = useRefreshToken(service);

service.interceptors.response.use(
  response => {
    if (shouldSkiped.has(response)) return response;
    // 处理刷新jwt失败的情况, 如跳转登录页, 切换游客模式等
    // 其他逻辑
    return response.data;
  },
  axios_error => {
    console.error('axios_error', axios_error);
    const { status, data: error } = axios_error?.response || {};
    switch (error.code) {
      case 400: // 业务错误
        console.error(
          ErrorEnum[error.reason as ErrorEnumKey] || error.message || axios_error.message,
          error,
        );
        if (error.reason === 'INVALID_ACCESS') {
          logout();
          break;
        }
        if (error.message === '非法访问') {
          logout();
          break;
        } else {
          message.error(error.message);
          return Promise.reject(axios_error);
        }
      case 403: // 禁止访问，退出系统
        message.error(error.message);
        logout();
        break;
      case 401: // token失效
        // message.error(error.message || '系统错误');
        // logout();
        break;
      case 404: // 接口未找到
        message.error('系统错误');
        break;
      case 500: // 系统错误
        message.error(error.message || '系统错误');
        break;
      default:
        if (status > 400 && status < 600) {
          message.error(error.message || '系统错误');
          break;
        } else if (!navigator.onLine) {
          console.error('网络未连接', error);
          return Promise.reject(axios_error);
        }
    }

    return Promise.reject(axios_error);
  },
);

export default service;
