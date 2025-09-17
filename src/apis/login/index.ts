import type { LoginResponse } from '@/interfaces/common/storage';
import _http from '@/helpers/http/index';

// 登录
export function loginRequest(params: {
  login_name: string;
  password: string;
  captcha_type: string;
}) {
  return _http.request<LoginResponse>({
    url: '/elan/v2/user/login',
    method: 'post',
    data: params,
  });
}

export function setPwdRequest(params: {
  login_name: string;
  password: string;
  new_password: string;
}) {
  return _http.request<null>({
    url: '/elan/v2/user/initial-password',
    method: 'put',
    data: params,
  });
}
