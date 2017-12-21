// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import routes from './router';

import MintUI from 'mint-ui';
import store from './store/index.js'; // import 刚创建的 store
import './../node_modules/mint-ui/lib/style.css';
import './../node_modules/font-awesome/css/font-awesome.min.css';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(MintUI);
Vue.config.productionTip = false;

const router = new VueRouter({
  routes
});
router.replace('/index');
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  template: '<App/>',
  components: { App }
});
