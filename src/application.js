const App = {
  SERVICE_URL: 'http://192.168.4.189:3000/api',
  TOKEN: localStorage.getItem('token'),
  // 过期token 测试用
  // TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJyb290IiwicGFzc3dvcmQiOiI0MGJkMDAxNTYzMDg1ZmMzNTE2NTMyOWVhMWZmNWM1ZWNiZGJiZWVmIn0sImlhdCI6MTUxMTg3MDM1NSwiZXhwIjoxNTExOTU2NzU1fQ.sJ6gRTkehX4qH6qrpd3SX7S1Bk4nECKQKFdarul-MPc',
  JURISDICTION: {
    superManager: [{id: '0', name: '待审核'}, {id: '1,3', name: '审核通过'}, {id: '2', name: '审核不通过'}],
    worker: [{id: '', name: '待作业'}, {id: '', name: '已提交'}, {id: '', name: '已完成'}, {id: '', name: '案例列表'}],
    manager: [{id: '0', name: '待审核'}, {id: '1,3', name: '已审核'}, {id: '2', name: '案例列表'}]
  },
  mergeJSON (minor, main) {
    for (var key in minor) {
      if (main[key] === undefined) {  // 不冲突的，直接赋值
        main[key] = minor[key];
        continue;
      }

      // 冲突了，如果是Object，看看有么有不冲突的属性
      // 不是Object 则以main为主，忽略即可。故不需要else
      if (this.isJSON(minor[key])) {
        // arguments.callee 递归调用，并且与函数名解耦
        arguments.callee(minor[key], main[key]);
      }
    }
  },
  isJSON (target) {
    return typeof target === 'object' && target.constructor === Object;
  }
};

export default App;
