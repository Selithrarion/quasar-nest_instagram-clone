import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Cookies, Notify } from 'quasar';
import { UserModel, UserUpdateTokenResponse } from 'src/models/user/user.model';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const http: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081/',
});

export default boot(async ({ store, urlPath, redirect, router }) => {
  let isUpdateTokenRequested = false;

  try {
    const savedUserData: UserModel = Cookies.get('user');
    if (savedUserData && savedUserData.accessToken && savedUserData.refreshToken) {
      const { accessToken } = savedUserData;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      await store.dispatch('user/loadUser', savedUserData);
    } else if (!urlPath.includes('/auth')) {
      await router.push(`/auth?redirect=${window.location.pathname}`);
    }
  } catch (e) {
    console.log(e);
  }

  http.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      console.log('INTERCEPTOR REQUEST', config);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const token = store.state.user.accessToken as string;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (token) http.defaults.headers.Authorization = `Bearer ${token}`;

      return config;
    },
    (error: AxiosError) => {
      console.error('INTERCEPTOR REQUEST ERROR', error);
      return Promise.reject(error);
    }
  );

  http.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('RESPONSE DATA -', response?.data);
      return response;
    },
    async (error: AxiosError) => {
      console.error('RESPONSE error', error, error.response);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const errorMessage = (error.response?.data?.message as string) || (error.response?.data?.error as string);

      const isAuthError = error.response?.status === 401;
      const isErrorWhenUpdateTokens = error.config.url === '/auth/update-tokens';

      if (isErrorWhenUpdateTokens) {
        await store.dispatch('user/logout');
        redirect('/auth?redirect');
        return;
      } else if (isAuthError && !isUpdateTokenRequested) {
        isUpdateTokenRequested = true;
        const data = (await store.dispatch('user/updateTokens')) as UserUpdateTokenResponse;
        if (!data.accessToken) redirect('/auth?redirect');
        location.reload();
      } else if (!isAuthError) {
        // TODO: add vue-18n error translation
        if (errorMessage)
          Notify.create({
            type: 'negative',
            message: errorMessage,
          });
      }

      return Promise.reject(error);
    }
  );
});

export { http };
