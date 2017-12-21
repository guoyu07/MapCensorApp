import Login from '@/components/login';
import Register from '@/components/register';
import IndexSuper from '@/components/index_super';
import IndexManager from '@/components/index_manager';
import IndexWorker from '@/components/index_worker';
// const Login = resolve => require(['@/components/login.vue'], resolve); //实现组件按需加载
// const Register = resolve => require(['@/components/register.vue'], resolve);
// const IndexSuper = resolve => require(['@/components/index_super.vue'], resolve);
// const IndexManager = resolve => require(['@/components/index_manager.vue'], resolve);
// const IndexWorker = resolve => require(['@/components/index_worker.vue'], resolve);

export default [{
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
  name: 'index_super'
}, {
  path: '/index_manager',
  component: IndexManager,
  name: 'index_manager'
}, {
  path: '/index_worker',
  component: IndexWorker,
  name: 'index_worker'
}, {
  path: '*',
  component: Login,
  name: 'login'
}];
