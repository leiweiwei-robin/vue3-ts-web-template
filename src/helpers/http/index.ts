import axiosService from '@/helpers/http/service';
import type { ResponseType } from 'axios';

class HttpService {
  get service() {
    return axiosService;
  }

  request<T = any>(args: {
    url: string;
    method?: string;
    data?: any;
    params?: any;
    headers?: any;
    responseType?: ResponseType;
  }): Promise<ApiResponseData<T>> {
    const finalHeaders = args.headers ?? {};
    return this.service.request({
      url: args.url,
      method: args.method ?? 'get',
      data: args.data,
      params: args.params,
      headers: finalHeaders,
      responseType: args.responseType,
    });
  }
}

const httpService = new HttpService();

export default httpService;
