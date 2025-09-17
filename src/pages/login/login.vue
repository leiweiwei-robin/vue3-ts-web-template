<script setup lang="ts">
  import { ref } from 'vue';
  import { CheckCircleOutlined } from '@ant-design/icons-vue';
  import type { UserInfo, UserJwt } from '@/interfaces/common/storage';
  import { loginRequest, setPwdRequest } from '@/apis/login';
  import { useStorageStore } from '@/stores/storage';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';

  interface FormState {
    login_name: string;
    password: string;
  }

  interface ModifyFormState {
    new_password: string;
    confirm_password: string;
  }

  const storageStore = useStorageStore();
  const state = ref('login');
  const formState = reactive<FormState>({
    login_name: '',
    password: '',
  });

  const modifyFormState = ref<ModifyFormState>({
    new_password: '',
    confirm_password: '',
  });

  const disabledBtn = computed(() => {
    return !formState.login_name || !formState.password;
  });

  const disabledNextBtn = computed(() => {
    return !modifyFormState.value.confirm_password || !modifyFormState.value.new_password;
  });

  async function onLogin() {
    const res = await loginRequest({
      login_name: formState.login_name,
      password: formState.password,
      captcha_type: 'blockPuzzle',
    });
    try {
      if (res.code !== 200) return;
      if (res.data.password_need_modify) {
        resetModifyForm();
        state.value = 'resetPwd';
        return;
      }

      if (!res.data.captcha_res) return;
      saveLogin(res.data.user_info, res.data.jwt);
      // router.push('/dashboard');
      window.location.href = '/dashboard';
    } catch (err) {
      console.log(err);
    }
  }

  function saveLogin(userInfo: UserInfo, jwt: UserJwt) {
    storageStore.saveAccessToken(jwt.access_token);
    storageStore.saveRefreshToken(jwt.refresh_token);
    storageStore.saveUser(userInfo);
    localStorage.setItem('factory_code', userInfo.factory_code);
  }

  function resetModifyForm() {
    modifyFormState.value = {
      confirm_password: '',
      new_password: '',
    };
  }

  async function onSetPwd() {
    const params = {
      login_name: formState.login_name,
      password: formState.password,
      new_password: modifyFormState.value.confirm_password,
    };
    const res = await setPwdRequest(params);
    try {
      if (res.code !== 200) return;
      state.value = 'resetDone';
      formState.login_name = '';
      formState.password = '';
    } catch (error) {
      console.log(error);
    }
  }

  function validatePass() {
    if (
      modifyFormState.value.new_password &&
      modifyFormState.value.confirm_password &&
      modifyFormState.value.new_password !== modifyFormState.value.confirm_password
    ) {
      return Promise.reject(new Error('两次输入密码不一致'));
    }
    return Promise.resolve();
  }

  const rules: Record<string, Rule[]> = {
    new_password: [{ validator: validatePass, trigger: 'blur', message: '两次输入密码不一致' }],
    confirm_password: [{ validator: validatePass, trigger: 'blur', message: '两次输入密码不一致' }],
  };

  const formRef = ref<FormInstance>();
</script>

<template>
  <div class="full-screen">
    <img src="/image/logo_fl.png" class="logo-corner" />

    <div class="main">
      <div class="title-image-wrap">
        <div class="title">欢迎来到</div>
        <div class="image" />
      </div>

      <!-- 用户登录 -->
      <div v-if="state === 'login'">
        <div class="sub-title">用户登录</div>
        <a-form :model="formState" class="login-form">
          <a-form-item name="login_name">
            <a-input v-model:value="formState.login_name" placeholder="请输入账号">
              <template #prefix>
                <fl-icon name="icon-yonghuming" class="icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password v-model:value="formState.password" placeholder="请输入密码">
              <template #prefix>
                <fl-icon name="icon-mima" class="icon" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :disabled="disabledBtn"
            size="large"
            shape="round"
            class="login-button"
            @click="onLogin"
          >
            登录
          </a-button>
        </a-form>
      </div>

      <!-- 设置密码 -->
      <div v-if="state === 'resetPwd'" class="resetPwd">
        <div class="sub-title">设置密码</div>
        <a-form ref="formRef" :model="modifyFormState" class="login-form">
          <a-form-item name="password" :rules="rules.new_password">
            <a-input-password
              v-model:value="modifyFormState.new_password"
              placeholder="请输入密码"
              @change="formRef?.validateFields()"
            >
              <template #prefix>
                <fl-icon name="icon-mima" class="icon" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item name="new_password" :rules="rules.confirm_password">
            <a-input-password
              v-model:value="modifyFormState.confirm_password"
              placeholder="请确认密码"
              @change="formRef?.validateFields()"
            >
              <template #prefix>
                <fl-icon name="icon-mima" class="icon" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-button
            type="primary"
            :disabled="disabledNextBtn"
            size="large"
            shape="round"
            class="login-button"
            @click="onSetPwd"
          >
            下一步
          </a-button>
        </a-form>
      </div>

      <!-- 设置密码 -->
      <div v-if="state === 'resetDone'">
        <div class="sub-title">设置密码</div>
        <div class="login-form">
          <div class="msg"><CheckCircleOutlined /> 您已经成功设置密码，请使用新密码登录</div>
          <a-button
            type="primary"
            size="large"
            shape="round"
            class="login-button"
            @click="state = 'login'"
          >
            马上登录
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .logo-corner {
    width: 180px;
    position: absolute;
    top: 34px;
    left: 36px;
  }

  .full-screen {
    height: 100%;
    min-width: 1000px;
    background-image: url(/image/login_bg_new.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .main {
    float: right;
    height: 100%;
    padding-top: 117px;
    width: 534px;
    background-color: #fff;
    text-align: center;
  }

  .title {
    font-size: 30px;
    font-weight: 500;
  }

  :host ::ng-deep .highlight {
    font-size: 36px;
  }

  .sub-title {
    padding-top: 80px;
    font-size: 20px;
    font-weight: 500;
  }

  .title-image-wrap {
    display: flex;
    justify-content: center;
    gap: 16px;

    .image {
      width: 155px;
      background-image: url(/image/logo_elan.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      background-origin: content-box;
    }
  }

  .login-form {
    margin: 20px 107px;
  }

  .ant-input-affix-wrapper {
    padding: 8px 11px;
    border-radius: 2px;
    &:hover,
    &:focus,
    &-focused {
      border-color: var(--fl-pretty-color);
    }
  }

  .icon {
    color: #c0c4cf;
  }

  .login-button {
    width: 100%;
    margin-top: 14px;
  }
</style>
