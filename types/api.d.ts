/** 所有 api 接口的响应数据都应该准守该格式 */
interface ApiResponseData<T> {
  code: number | string;
  data: T;
  message: string;
  success: boolean;
  records: any;
  total?: number;
  page?: number;
  plan_ids?: number[];
  status?: T;
}
