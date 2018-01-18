export default {
  user: (state) => {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) {
      // 深拷贝
      state = Object.assign({}, state, user);
    }
    return state;
  },
  list: (state) => {
    let list = JSON.parse(localStorage.getItem('list'));
    state = Object.assign({}, state, list);
    return state;
  },
  caseList: (state) => {
    return state.caseList;
  },
  caseInfo: (state) => {
    return state.caseInfo;
  },
  // casePageNum: (state) => {
  //   return state.casePageNum;
  // },
  // 地图相关
  map: (state) => {
    return state.map;
  }
};
