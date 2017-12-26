/**
 * [description]
 * @file     http.js
 * @author   Administrator
 * @date     2017/12/25/025
 *
 *
 * @copyright @Navinfo, all rights reserved.
 */

import axios from 'axios';
import store from './store';
import router from './router';

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'https://api.github.com';
// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      // config.headers.Authorization = `token ${store.state.token}`;
    }
    console.info(store.state.token);
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response) {
      if (response.data.errorCode === -1 && response.data.message === 'jwt expired') {
        // token过期
        store.commit('SHOW_USER', {});
        router.replace({
          path: 'login',
          query: {redirect: router.currentRoute.fullPath}
        });
      }
    }
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          store.commit(types.LOGOUT);
          router.replace({
            path: 'login',
            query: {redirect: router.currentRoute.fullPath}
          });
          return Promise.reject(error);   // 返回接口返回的错误信息
      }
    }
    return Promise.resolve(error.response);
  });

export default axios;
