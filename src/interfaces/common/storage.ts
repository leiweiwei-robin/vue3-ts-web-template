export interface LoginResponse {
  user_info: UserInfo;
  jwt: UserJwt;
  captcha_res: boolean;
  password_need_modify: boolean;
}

export interface UserInfo {
  employee_code: string;
  employee_id: string | null;
  employee_name: string;
  factory_code: string;
  name: string;
  user_id: number;
  roles: {
    priority: number;
    role_id: number;
    role_name: string;
  }[];
}

export interface UserJwt {
  refresh_token: string;
  access_token: string;
}
