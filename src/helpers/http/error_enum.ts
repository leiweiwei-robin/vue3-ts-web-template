export enum ErrorEnum {
  unknown = '系统出错啦',
  INVALID_ACCESS = '非正常请求',
  USER_DISABLED = '当前用户已被禁用',
  FORCE_QUIT_DUP_SESSION = '当前用户已在其他系统登录',
  FORCE_QUIT_PERM_CHANGE = '当前权限发生变更,请重新登录~',
  FORCE_QUIT_USER_INFO_CHANGE = '当前操作账号发生变更,请重新登录~',
  JWT_REFRESH_TOKEN_EXPIRED = '当前登录失效，请重新登录',
  SYS_ERROR = '系统繁忙，请稍后重试',
  UNHANDLED_ERROR = '系统内部问题，请联系管理员',
  INVALID_USERNAME_PASSWORD = '用户名或密码错误',
  API_PARAM_FORMAT_ERROR = '参数格式错误',
  FACTORY_EXIST = '工厂已经存在,请检查工厂编码或工厂域名',
  FACTORY_INIT_FINISHED = '工厂初始化已完成',
  VALIDATION_ERROR = '校验失败',
  NOINTERNET = '网络未连接',
  FORCE_QUIT_USER_ALREADY_LOGOUT = '用户已经登出',
  FORCE_QUIT_NO_PERMISSION = '当前用户无权限，请重新登录',
  FORCE_QUIT_USER_DELETED = '当前操作账号已失效,请联系管理员~',
  FORCE_QUIT_USER_DISABLED = '当前操作账号已禁用,请联系管理员~',
  FORCE_QUIT_USER_EMPLOYEE_DISABLED = '当前员工已离职,请联系管理员~',
  FORCE_QUIT_USER_DEPARTMENT_DISABLED = '当前上级部门已禁用,请联系管理员~',
  FORCE_QUIT_PASSWORD_BEEN_MODIFIED = '当前密码被重置,请用新密码重新登录~',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DEPARTMENT_NOT_ENABLED = '当前上级部门已禁用,请联系管理员~',
}

export type ErrorEnumKey = keyof typeof ErrorEnum;
