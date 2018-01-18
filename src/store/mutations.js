const SHOW_USER = 'SHOW_USER';  // 记录登录账户
const GET_LIST = 'GET_LIST';  // 请求列表数据
const GET_LIST_MORE = 'GET_LIST_MORE';  // 请求更多数据
const GET_PROJECT_LIST = 'GET_PROJECT_LIST';  // 请求项目列表数据
const GET_PROJECT_MORE = 'GET_PROJECT_MORE';  // 请求更多项目数据
const SET_TOKEN = 'SET_TOKEN';  // 赋值token
const SET_CASE = 'SET_CASE';  // 新案例赋值
const SET_MAP = 'SET_MAP';  // 设置地图属性

export default {
  [SHOW_USER] (state, value) {
    localStorage.setItem('user', JSON.stringify(value));
    console.log('账户：' + value.username, value.password, value.role);
    state.username = value.username || '';
    state.password = value.password || '';
    state.role = value.role || '';
  },
  [GET_LIST] (state, value) {
    localStorage.setItem('list', JSON.stringify(value));
    state.userList = value.userList;
    state.timeLine = value.timeLine;
  },
  [GET_LIST_MORE] (state, value) {
    state.userList = state.userList.concat(value.userList);
    state.timeLine = value.timeLine;
  },
  [GET_PROJECT_LIST] (state, value) {
    localStorage.setItem('list', JSON.stringify(value));
    state.list = value.projectList;
    state.timeLine = value.timeLine;
  },
  [GET_PROJECT_MORE] (state, value) {
    state.list = state.list.concat(value.projectList);
    state.timeLine = value.timeLine;
  },
  [SET_TOKEN] (state, value) {
    state.token = value;
  },
  [SET_CASE] (state, value) {
    if (!value.id && value.marker) {
      // 新建
      state.caseInfo = value;
    } else {
      state.caseInfo = Object.assign({}, state.caseInfo, value);
    }
  },
  [SET_MAP] (state, value) {
    state.map = value;
  }
};
