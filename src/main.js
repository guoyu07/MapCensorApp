// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import router from './router';
import axios from './http.js';
import Application from './application.js';

import MintUI from 'mint-ui';
import store from './store/index.js'; // import 刚创建的 store
import 'mint-ui/lib/style.css';
import 'font-awesome/css/font-awesome.min.css';
import VeeValidate from 'vee-validate';
import zh from 'vee-validate/dist/locale/zh_CN';  // 引入中文文件

Vue.use(VueRouter);
Vue.use(MintUI);
Vue.use(VeeValidate);
Vue.prototype.app = Application;

Vue.config.productionTip = false;

// const router = new VueRouter({
//   routes
// });
router.replace('/index');
/* eslint-disable no-new */
new Vue({
  el: '#app',
  axios,
  router,
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  template: '<App/>',
  components: { App }
});
