import axios from './../http.js';
import Application from './../application.js';
import { Toast } from 'mint-ui';

// post公共
let axiosPost = function (url, param, suc) {
  if (!param) {
    param = {};
  }
  if (url !== '/om/user/login' && url !== '/om/user/register' && url !== '/om/user/getPassport' && url !== '/om/user/resetPassword') {
    param.token = Application.TOKEN;
  }
  axios.post(Application.SERVICE_URL + url, param).then(suc).catch(err => {
    Toast({
      message: '请求失败!失败原因：' + err,
      position: 'bottom'
    });
  });
};
// get公共
let axiosGet = function (url, param, suc) {
  if (!param) {
    param = {};
  }
  if (url !== '/om/user/login' && url !== '/om/user/register' && url !== '/om/user/getPassport' && url !== '/om/user/resetPassword') {
    param.token = Application.TOKEN;
  }
  axios.get(Application.SERVICE_URL + url, {params: param}).then(suc).catch(err => {
    Toast({
      message: '请求失败!失败原因：' + err,
      position: 'bottom'
    });
  });
};
// 地图post服务
let mapAxiosPost = function (url, param, suc) {
  if (!param) {
    param = {};
  }
  axios.post(url, param).then(suc).catch(err => {
    Toast({
      message: '请求失败!失败原因：' + err,
      position: 'bottom'
    });
  });
};

// 地图get服务
let mapAxiosGet = function (url, param, suc) {
  if (!param) {
    param = {};
  }
  param.key = Application.TX_KEY;
  axios.get('/api/ws' + url, {params: param}).then(suc).catch(err => {
    Toast({
      message: '请求失败!失败原因：' + err,
      position: 'bottom'
    });
  });
};

export default {
  // 登录
  login (context, obj) {
    axiosPost('/om/user/login', {
      userName: obj.username,
      password: obj.password
    }, res => {
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
    });
      // axios.post(Application.SERVICE_URL + '/om/user/login', {
      //   userName: obj.username,
      //   password: obj.password
      // }).then(function (res) {
      //   if (res.data.errorCode > -1) {
      //     context.commit('SHOW_USER', {
      //       role: res.data.result.role,
      //       username: obj.username,
      //       password: obj.password
      //     });
      //     Application.TOKEN = res.data.result.token;
      //     localStorage.setItem('token', Application.TOKEN);
      //     Toast({
      //       message: '登录成功!',
      //       position: 'bottom'
      //     });
      //   } else {
      //     Toast({
      //       message: res.data.message,
      //       position: 'bottom'
      //     });
      //   }
      // }).catch(function (err) {
      //   console.log(err);
      //   Toast({
      //     message: '登录失败!',
      //     position: 'bottom'
      //   });
      // });
  },
  register (context, obj) {
    axiosPost('/om/user/register', {
      userName: obj.username,
      password: obj.password,
      company: obj.company,
      cellPhone: obj.cellPhone,
      fullName: obj.fullName,
      email: obj.email
    }, res => {
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
    });
    // axios.post(Application.SERVICE_URL + '/om/user/register', {
    //   userName: obj.username,
    //   password: obj.password,
    //   company: obj.company,
    //   cellPhone: obj.cellPhone,
    //   fullName: obj.fullName,
    //   email: obj.email
    // }).then(function (res) {
    //   console.log(res);
    //   if (res.data.errorCode > -1) {
    //     Toast({
    //       message: '注册成功，等待管理员审核!',
    //       position: 'bottom'
    //     });
    //   } else {
    //     Toast({
    //       message: res.data.message,
    //       position: 'bottom'
    //     });
    //   }
    // }).catch(function (err) {
    //   console.log(err);
    //   Toast({
    //     message: '注册失败！',
    //     position: 'bottom'
    //   });
    // });
  },
  // 退出登录
  layout (context) {
    context.commit('SHOW_USER', {
      username: '',
      role: ''
    });
  },
  // 查询列表数据
  getUserList (context, obj) {
    axiosGet('/om/user/find', {
      status: '[' + obj.status.toString() + ']',
      pageSize: obj.pageSize,
      pageNum: obj.pageNum
    }, res => {
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
        if (obj.callback) {
          obj.callback();
        }
      } else {
        Toast({
          message: res.data.message,
          position: 'bottom'
        });
      }
    });
    // axios.get(Application.SERVICE_URL + '/om/user/find', {
    //   params: {
    //     status: '[' + obj.status.toString() + ']',
    //     pageSize: obj.pageSize,
    //     pageNum: obj.pageNum,
    //     token: Application.TOKEN
    //   }
    // }).then(function (res) {
    //   if (res.data.errorCode > -1) {
    //     // 加载更多
    //     if (obj.type) {
    //       context.commit('GET_LIST_MORE', {
    //         userList: res.data.result.data,
    //         timeLine: Date.parse(new Date())
    //       });
    //     } else {  // 刷新列表
    //       context.commit('GET_LIST', {
    //         userList: res.data.result.data,
    //         timeLine: Date.parse(new Date())
    //       });
    //     }
    //     if (obj.callback()) {
    //       obj.callback();
    //     }
    //   } else {
    //     Toast({
    //       message: res.data.message,
    //       position: 'bottom'
    //     });
    //   }
    // }).catch(function (err) {
    //   console.log(err);
    //   Toast({
    //     message: '查询失败!',
    //     position: 'bottom'
    //   });
    // });
  },
  // 审核用户
  checkUser (context, obj) {
    axiosPost('/om/user/auditUser', {
      status: obj.status,
      userId: obj.userId,
      roleId: obj.roleId
    }, res => {
      if (res.data.errorCode > -1) {
        if (obj.callback) {
          obj.callback();
        }
      }
      Toast({
        message: res.data.message,
        position: 'bottom'
      });
    });
    // axios.post(Application.SERVICE_URL + '/om/user/auditUser', {
    //   status: obj.status,
    //   userId: obj.userId,
    //   roleId: obj.roleId,
    //   token: Application.TOKEN
    // }).then(function (res) {
    //   if (res.data.errorCode > -1) {
    //     if (obj.callback()) {
    //       obj.callback();
    //     }
    //   }
    //   Toast({
    //     message: res.data.message,
    //     position: 'bottom'
    //   });
    // }).catch(function (err) {
    //   console.log(err);
    //   Toast({
    //     message: '审核失败!失败原因：' + err,
    //     position: 'bottom'
    //   });
    // });
  },
  // 查询项目列表数据
  getProjectList (context, obj) {
    axiosGet('/bs/project/list', {
      projectStatus: '[' + obj.status.toString() + ']',
      pageSize: obj.pageSize,
      pageNum: obj.pageNum
    }, res => {
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
        if (obj.callback) {
          obj.callback();
        }
      } else {
        Toast({
          message: res.data.message,
          position: 'bottom'
        });
      }
    });
    // axios.get(Application.SERVICE_URL + '/bs/project/list', {
    //   params: {
    //     projectStatus: '[' + obj.status.toString() + ']',
    //     pageSize: obj.pageSize,
    //     pageNum: obj.pageNum,
    //     token: Application.TOKEN
    //   }
    // }).then(function (res) {
    //   if (res.data.errorCode > -1) {
    //     // 加载更多
    //     if (obj.type) {
    //       context.commit('GET_PROJECT_MORE', {
    //         projectList: res.data.result.data,
    //         timeLine: Date.parse(new Date())
    //       });
    //     } else {  // 刷新列表
    //       context.commit('GET_PROJECT_LIST', {
    //         projectList: res.data.result.data,
    //         timeLine: Date.parse(new Date())
    //       });
    //     }
    //     if (obj.callback()) {
    //       obj.callback();
    //     }
    //   } else {
    //     Toast({
    //       message: res.data.message,
    //       position: 'bottom'
    //     });
    //   }
    // }).catch(function (err) {
    //   console.log(err);
    //   Toast({
    //     message: '查询失败!',
    //     position: 'bottom'
    //   });
    // });
  },
  // 审核项目
  checkProject (context, obj) {
    axiosPost('/bs/project/auditPro', {
      projectId: obj.projectId,
      projectStatus: obj.projectStatus
    }, res => {
      if (res.data.errorCode > -1) {
        if (obj.callback) {
          obj.callback();
        }
      }
      Toast({
        message: res.data.message,
        position: 'bottom'
      });
    });
    // axios.post(Application.SERVICE_URL + '/bs/project/auditPro', {
    //   projectId: obj.projectId,
    //   projectStatus: obj.projectStatus,
    //   token: Application.TOKEN
    // }).then(function (res) {
    //   if (res.data.errorCode > -1) {
    //     if (obj.callback()) {
    //       obj.callback();
    //     }
    //   }
    //   Toast({
    //     message: res.data.message,
    //     position: 'bottom'
    //   });
    // }).catch(function (err) {
    //   console.log(err);
    //   Toast({
    //     message: '审核失败!失败原因：' + err,
    //     position: 'bottom'
    //   });
    // });
  },
  // 案例列表
  getCaseList (context, obj) {
    axiosGet('/bs/case/list', {
      pageSize: obj.pageSize,
      pageNum: obj.pageNum
    }, res => {
      if (res.data.errorCode > -1) {
        // 加载更多
        if (obj.type) {
          context.commit('GET_CASE_MORE', {
            caseList: res.data.result.data
          });
        } else {  // 刷新列表
          context.commit('GET_CASE_LIST', {
            caseList: res.data.result.data
          });
        }
        if (obj.callback) {
          obj.callback(res.data.result);
        }
      }
    });
  },
  // 创建案例
  createCase (context, obj) {
    axiosPost('/bs/case/create', {
      caseSnap: obj.caseSnap,
      caseDesc: obj.caseDesc, // 案例描述
      caseMethod: obj.caseMethod, // 处理方法
      images: obj.images, // 图片
      videos: obj.videos, // 视频
      marker: obj.marker // 点位
    }, res => {
      if (res.data.errorCode > -1) {
        let newCase = res.data.result.data;
        // 创建成功后创建form初始化
        context.commit('SET_CASE', {
          caseSnap: '', // 案例概述
          caseDesc: '', // 案例描述
          caseMethod: '', // 处理方法
          images: [], // 图片
          videos: [], // 视频
          marker: null // 点位
        });
        if (obj.callback) {
          obj.callback(newCase);
        }
      }
      Toast({
        message: res.data.message,
        position: 'bottom'
      });
    });
  },
  // 修改案例
  updateCase (context, obj) {
    if (obj.images.length) {
      for (let i = 0; i < obj.images.length; i++) {
        obj.images[i] = obj.images[i].replace(Application.SERVICE, '');
      }
    }
    axiosPost('/bs/case/update', {
      id: obj.id,
      caseSnap: obj.caseSnap,
      caseDesc: obj.caseDesc, // 案例描述
      caseMethod: obj.caseMethod, // 处理方法
      images: obj.images, // 图片
      videos: obj.videos, // 视频
      marker: obj.marker // 点位
    }, res => {
      if (res.data.errorCode > -1) {
        context.commit('SET_CASE', obj);
        if (obj.callback) {
          obj.callback();
        }
      }
      Toast({
        message: res.data.message,
        position: 'bottom'
      });
    });
  },
  // 删除案例
  deleteCase (context, obj) {
    axiosGet('/bs/case/delete', {
      id: obj.id
    }, res => {
      if (res.data.errorCode > -1) {
        if (obj.callback) {
          obj.callback();
        }
      }
      Toast({
        message: res.data.message,
        position: 'bottom'
      });
    });
  },
  // 案例查询
  queryCaseInfo (context, obj) {
    axiosGet('/bs/case/query', {
      id: obj.id
    }, res => {
      if (res.data.errorCode > -1) {
        console.log(res.data.result);
        context.commit('SET_CASE', res.data.result.data);
        if (obj.callback) {
          obj.callback(res.data.result);
        }
      }
    });
  },
  /**
   * **************************** 腾讯地图服务 *********************************
   */
  // 地图搜索输入提示
  autoCompleteList (context, obj) {
    mapAxiosGet('/place/v1/suggestion', {
      keyword: obj.keyword
    }, res => {
      console.log(res);
      if (res.data.status === 0) {
        if (obj.callback) {
          obj.callback(res.data);
        }
      }
    });
  },
  // 逆地址解析
  geoReverse (context, obj) {
    mapAxiosGet('/geocoder/v1/', {
      location: obj.location,
      get_poi: 1
    }, res => {
      console.log(res);
      if (res.data.status === 0) {
        if (obj.callback) {
          obj.callback(res.data);
        }
      }
    });
  },
  // 根据地名搜索详情
  searchPoiByTitle (context, obj) {
    mapAxiosGet('/place/v1/search', {
      keyword: obj.keyword,
      // city_name：检索区域名称， 城市名字，如北京市。
      // auto_extend：可选参数。 取值1：默认值，若当前城市搜索无结果，则自动扩大范围；
      // 取值0：仅在当前城市搜索。
      boundary: obj.boundary
    }, res => {
      console.log(res);
      if (res.data.status === 0) {
        if (obj.callback) {
          obj.callback(res.data);
        }
      }
    });
  }
};
