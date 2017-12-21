export default {
  user: (state) => {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) {
      state = user;
    }
    return state;
  },
  list: (list) => {
    let userList = JSON.parse(localStorage.getItem('list'));
    console.log(userList);
    if (userList && userList.length) {
      list = userList;
    }
    return list;
  }
};
