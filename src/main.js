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

Vue.use(VueRouter);
Vue.use(MintUI);
Vue.use(VeeValidate);
Vue.config.productionTip = false;

// const router = new VueRouter({
//   routes
// });
router.replace('/index');
// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios;
Vue.prototype.app = Application;
Vue.prototype.mint = MintUI;
Vue.prototype.validate = VeeValidate;
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
