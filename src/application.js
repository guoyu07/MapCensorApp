const App = {
  SERVICE_URL: 'http://192.168.4.189:3000/api',
  TOKEN: localStorage.getItem('token'),
  JURISDICTION: {
    superManager: [{id: '0', name: '待审核'}, {id: '1,3', name: '审核通过'}, {id: '2', name: '审核不通过'}],
    worker: [{id: '', name: '待作业'}, {id: '', name: '已提交'}, {id: '', name: '已完成'}, {id: '', name: '案例列表'}],
    manager: [{id: '0', name: '待审核'}, {id: '1,3', name: '已审核'}, {id: '2', name: '案例列表'}]
  }
};

export default App;
