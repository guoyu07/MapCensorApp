import Application from './../application.js';
export default {
  user: (state) => {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) {
      // state.username = user.username;
      // state.role = user.role;
      // 深拷贝
      state = Object.assign({}, state, user);
    }
    return state;
  },
  list: (state) => {
    let list = JSON.parse(localStorage.getItem('list'));
    state = Object.assign({}, state, list);
    return state;
  }
};
