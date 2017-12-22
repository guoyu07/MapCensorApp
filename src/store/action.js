import axios from 'axios';
import Application from './../application.js';
import { Toast } from 'mint-ui';

export default {
  login (context, obj) {
    if (Object.keys(obj).some(function (key) {
      return obj[key] === '';
    })) {
      Toast({
        message: '用户名和密码不能为空',
        position: 'bottom'
      });
    } else {
      //          context.dispatch('login',obj);
      axios.post(Application.SERVICE_URL + '/om/user/login', {
        userName: obj.username,
        password: obj.password
      }).then(function (res) {
        if (res.data.errorCode > -1) {
          context.commit('SHOW_USER', {
            role: res.data.result.role,
            username: obj.username,
            password: obj.password
          });
          Application.TOKEN = res.data.result.token;
          localStorage.setItem('token', Application.TOKEN);
          Toast({
            message: '登录成功!',
            position: 'bottom'
          });
        } else {
          Toast({
            message: res.data.message,
            position: 'bottom'
          });
        }
      }).catch(function (err) {
        console.log(err);
        Toast({
          message: '登录失败!',
          position: 'bottom'
        });
      });
    }
  },
  register (context, obj) {
    // 校验
    if (!(obj.username && obj.fullName && obj.password && obj.email)) {
      Toast({
        message: '账号、全称、邮箱、密码必须填写!',
        position: 'bottom'
      });
      return;
    }
    if (obj.password !== obj.conformPsw) {
      Toast({
        message: '两次密码必须一致!',
        position: 'bottom'
      });
      return;
    }
    axios.post(Application.SERVICE_URL + '/om/user/register', {
      userName: obj.username,
      password: obj.password,
      company: obj.company,
      cellPhone: obj.cellPhone,
      fullName: obj.fullName,
      email: obj.email
    }).then(function (res) {
      console.log(res);
      if (res.data.errorCode > -1) {
        Toast({
          message: '注册成功，等待管理员审核!',
          position: 'bottom'
        });
      } else {
        Toast({
          message: res.data.message,
          position: 'bottom'
        });
      }
    }).catch(function (err) {
      console.log(err);
      Toast({
        message: '注册失败！',
        position: 'bottom'
      });
    });
  },
  // 退出登录
  layout (context) {
    context.commit('SHOW_USER', {});
  },
  // 查询列表数据
  getUserList (context, obj) {
    let self = this;
    axios.get(Application.SERVICE_URL + '/om/user/find', {
      params: {
        status: '[' + obj.status.toString() + ']',
        pageSize: obj.pageSize,
        pageNum: obj.pageNum,
        token: Application.TOKEN
      }
    }).then(function (res) {
      if (res.data.errorCode > -1) {
        // 加载更多
        if (obj.type) {
          context.commit('GET_LIST_MORE', {
            userList: res.data.result.data,
            timeLine: Date.parse(new Date())
          });
        } else {  // 刷新列表
          context.commit('GET_LIST', {
            userList: res.data.result.data,
            timeLine: Date.parse(new Date())
          });
        }
        if (obj.callback()) {
          obj.callback();
        }
      } else {
        Toast({
          message: res.data.message,
          position: 'bottom'
        });
      }
    }).catch(function (err) {
      console.log(err);
      Toast({
        message: '查询失败!',
        position: 'bottom'
      });
    });
  },
  // 审核用户
  checkUser (context, obj) {
    let self = this;
    axios.post(Application.SERVICE_URL + '/om/user/auditUser', {
      status: obj.status,
      userId: obj.userId,
      roleId: obj.roleId,
      token: Application.TOKEN
    }).then(function (res) {
      if (res.data.errorCode > -1) {
        if (obj.callback()) {
          obj.callback();
        }
      }
      Toast({
        message: res.data.message,
        position: 'bottom'
      });
    }).catch(function (err) {
      console.log(err);
      Toast({
        message: '审核失败!失败原因：' + err,
        position: 'bottom'
      });
    });
  },
  // 查询项目列表数据
  getProjectList (context, obj) {
    let self = this;
    axios.get(Application.SERVICE_URL + '/bs/project/list', {
      params: {
        projectStatus: '[' + obj.status.toString() + ']',
        pageSize: obj.pageSize,
        pageNum: obj.pageNum,
        token: Application.TOKEN
      }
    }).then(function (res) {
      if (res.data.errorCode > -1) {
        // 加载更多
        if (obj.type) {
          context.commit('GET_PROJECT_MORE', {
            projectList: res.data.result.data,
            timeLine: Date.parse(new Date())
          });
        } else {  // 刷新列表
          context.commit('GET_PROJECT_LIST', {
            projectList: res.data.result.data,
            timeLine: Date.parse(new Date())
          });
        }
        if (obj.callback()) {
          obj.callback();
        }
      } else {
        Toast({
          message: res.data.message,
          position: 'bottom'
        });
      }
    }).catch(function (err) {
      console.log(err);
      Toast({
        message: '查询失败!',
        position: 'bottom'
      });
    });
  },
  // 审核项目
  checkProject (context, obj) {
    let self = this;
    axios.post(Application.SERVICE_URL + '/bs/project/auditPro', {
      projectId: obj.projectId,
      projectStatus: obj.projectStatus,
      token: Application.TOKEN
    }).then(function (res) {
      if (res.data.errorCode > -1) {
        if (obj.callback()) {
          obj.callback();
        }
      }
      Toast({
        message: res.data.message,
        position: 'bottom'
      });
    }).catch(function (err) {
      console.log(err);
      Toast({
        message: '审核失败!失败原因：' + err,
        position: 'bottom'
      });
    });
  }
};
