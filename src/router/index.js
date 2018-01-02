import Vue from 'vue';
import store from './../store'; // import 刚创建的 store
import VueRouter from 'vue-router';

import Login from '@/components/login';
import Register from '@/components/register';
import IndexSuper from '@/components/index_super';
import IndexManager from '@/components/index_manager';
import IndexWorker from '@/components/index_worker';
import CaseList from '@/components/case_list';
import CensorDlg from '@/components/censorDlg';

Vue.use(VueRouter);
// const Login = resolve => require(['@/components/login.vue'], resolve); //实现组件按需加载
// const Register = resolve => require(['@/components/register.vue'], resolve);
// const IndexSuper = resolve => require(['@/components/index_super.vue'], resolve);
// const IndexManager = resolve => require(['@/components/index_manager.vue'], resolve);
// const IndexWorker = resolve => require(['@/components/index_worker.vue'], resolve);

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login'
  }, {
    path: '/register',
    component: Register,
    name: 'register'
  }, {
    path: '/index_super',
    component: IndexSuper,
    // 需要登录才能进入的页面可以增加一个meta属性
    meta: {
      requireAuth: true
    },
    name: 'index_super'
  }, {
    path: '/index_manager',
    component: IndexManager,
    // 需要登录才能进入的页面可以增加一个meta属性
    meta: {
      requireAuth: true
    },
    name: 'index_manager'
  }, {
    path: '/index_worker',
    component: IndexWorker,
    // 需要登录才能进入的页面可以增加一个meta属性
    meta: {
      requireAuth: true
    },
    name: 'index_worker'
  }, {
    path: '/case_list',
    component: CaseList,
    // 需要登录才能进入的页面可以增加一个meta属性
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: 'censor',
        component: CensorDlg
      }
    ],
    name: 'case_list'
  }, {
    path: '*',
    component: Login,
    name: 'login'
  }];

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
  store.commit('SET_TOKEN', window.localStorage.getItem('token'));
}

const router = new VueRouter({
  routes
});

// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (store.state.token) {  // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});

export default router;
