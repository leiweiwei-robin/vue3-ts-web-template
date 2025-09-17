import _http from '@/helpers/http/index';

// 获取菜单
export function getMenuRequest() {
  return _http.request({
    url: '/elan/v2/menu',
    method: 'get',
    data: {},
  });
}
