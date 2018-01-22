import Vue from 'vue';
import Vuex from 'vuex';
import actions from './action';
import getters from './getters';
import mutations from './mutations';
// 告诉 vue “使用” vuex
Vue.use(Vuex);

// 创建一个对象来保存应用启动时的初始状态
const state = {
  username: '',
  list: [],
  userList: [],
  role: '',
  strLength: '',
  timeLine: '',
  projectList: [],
  map: null,
  caseList: [],
  casePageNum: 1,
  selectProject: null,  // 选择的项目
  caseInfo: {
    caseSnap: '', // 案例概述
    caseDesc: '', // 案例描述
    caseMethod: '', // 处理方法
    images: [], // 图片
    videos: [], // 视频
    marker: null // 点位
  }, // 新建案例
  token: ''
};
// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
});
