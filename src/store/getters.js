import Application from './../application.js';
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
    // let fmtImages = [];
    // if (state.caseInfo.images.length) {
    //   for (let i = 0; i < state.caseInfo.images.length; i++) {
    //     fmtImages.push(Application.SERVICE + state.caseInfo.images[i]);
    //   }
    //   state.caseInfo.images = fmtImages;
    // }
    return state.caseInfo;
  },
  selectProject: (state) => {
    return state.selectProject;
  },
  issueInfo: (state) => {
    return state.issueInfo;
  },
  // casePageNum: (state) => {
  //   return state.casePageNum;
  // },
  // 地图相关
  map: (state) => {
    return state.map;
  }
};
