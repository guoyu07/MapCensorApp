<style media="screen">
  .user-list-cell .mint-cell-title {
    text-align: left;
  }
</style>
<template>
    <div class="page-tabbar" id="index_super">
        <mt-tab-container class="page-tabbar-container" v-model="selected" swipeable>
            <mt-tab-container-item :id="item.id" v-for="item in tabList" :key="item.index">
              <mt-loadmore :top-method="loadTopRefresh" :top-status.sync="item.topStatus" ref="loadmore" v-infinite-scroll="loadMoreList"
                           infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                <!--<mt-search v-model="searchText" show>-->
                <mt-cell class="user-list-cell" :title="user.fullName" :label="user.userName" :key="user.id"  v-for="user in list.list">
                  <div v-if="selected === '0'">
                    <mt-button type="primary" @click="doCheckInit(user)">审核</mt-button>
                  </div>
                  <div v-if="selected === '1,3'">
                    <mt-button type="primary">强制过期</mt-button>
                    <mt-button type="danger">停用</mt-button>
                  </div>
                  <div v-if="selected === '2'">
                    <mt-button type="primary">重新审核</mt-button>
                  </div>
                  <!--<span style="color: green">{{user.userName}}</span>-->
                </mt-cell>
                <!--</mt-search>-->
                <div slot="top" class="mint-loadmore-top">
                  <span v-show="item.topStatus !== 'loading'" :class="{ 'rotate': item.topStatus === 'drop' }">↓</span>
                  <mt-spinner v-show="item.topStatus === 'loading'" color="#26a2ff" type="triple-bounce"></mt-spinner>
                </div>
              </mt-loadmore>
            </mt-tab-container-item>
          </mt-tab-container>
          <mt-spinner type="triple-bounce" v-show="loading" color="#26a2ff"></mt-spinner>
          <mt-tabbar v-model="selected" class="is-fixed">
              <mt-tab-item :id="item.id" v-for="item in tabList">
                <i slot="icon" :class="item.icon"></i>
                <div>{{item.name}}</div>
              </mt-tab-item>
          </mt-tabbar>
        </div>
</template>
<script>
// import {mapGetters} from 'vuex';
import {mapGetters, mapState} from 'vuex';
import './../less/index_main.less';
import Application from './../application.js';
import { MessageBox } from 'mint-ui';
export default {
  name: 'index_super',
  data () {
    return {
      selected: '0',
      topStatus: '',
      userList: this.$store.getters.list.list,
      pageNum: 1,
      pageSize: 20,
      timeLine: this.$store.getters.list.timeLine,
      loading: false,
//      searchText: '', // 搜索内容
      tabList: [
        {id: '0', name: '待审核', index: 0, topStatus: '', icon: 'fa fa-eye'},
        {id: '1,3', name: '审核通过', index: 1, topStatus: '', icon: 'fa fa-check'},
        {id: '2', name: '审核不通过', index: 2, topStatus: '', icon: 'fa fa-warning'}
      ],
      userRole: '', // 分配的角色
      userStatus: '', // 分配状态
      selectUser: ''
    };
  },
  methods: {
    // 查询列表
    getUserList (type) {
      let obj = {};
      let self = this;
      obj.status = [this.selected];
      obj.pageNum = this.pageNum || 1;
      obj.pageSize = this.pageSize || 20;
      obj.type = type;  // 0 刷新 1加载更多
      obj.callback = function () {
        for (let i = 0; i < self.$refs.loadmore.length; i++) {
          self.tabList[i].topStatus = '';
          self.$refs.loadmore[i].onTopLoaded();
        }
        self.loading = false;
      };
      this.$store.dispatch('getUserList', obj);
    },
    // 顶部下拉刷新列表
    loadTopRefresh () {
      this.initData();
      for (let i = 0; i < this.tabList.length; i++) {
        this.tabList[i].topStatus = 'loading';
      }
      this.getUserList();
    },
    // 加载更多
    loadMoreList () {
      // 数据未满20*?，不用加载更多
      if (this.list.list.length < this.pageNum * this.pageSize) {
        return;
      }
      console.log('加载更多');
      this.loading = true;
      this.pageNum++;
      this.getUserList(1);
    },
    // 审核调用接口
    doCheckUser () {
      let obj = {};
      let self = this;
      obj.status = parseInt(this.userStatus, 10);
      obj.userId = this.selectUser.id;
      obj.roleId = this.userRole ? parseInt(this.userRole, 10) : '';
      obj.callback = function () {
        self.loadTopRefresh();
      };
      this.$store.dispatch('checkUser', obj);
    },
    // 审核
    doCheckInit (user) {
      let self = this;
      MessageBox({
        title: '注册账号审核',
        message: `<div class="mint-radiolist">
           <div class="">设置角色</div>
           <div style="display: flex">
            <a class="mint-cell">
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                  <label class="mint-radiolist-label" @click="test">
                   <span class="mint-radio">
                    <input type="radio" v-model="userRole" name="userRole" class="mint-radio-input" value="2" checked>
                    <span class="mint-radio-core"></span>
                   </span>
                   <span class="mint-radio-label">作业员</span>
                 </label>
               </div>
              </div>
             </a>
             <a class="mint-cell">
              <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                <label class="mint-radiolist-label" @click="test">
                  <span class="mint-radio">
                    <input type="radio" v-model="userRole" name="userRole" class="mint-radio-input" value="3">
                     <span class="mint-radio-core"></span>
                   </span>
                    <span class="mint-radio-label">管理员</span>
                  </label>
                  </div>
                 </div>
              </a>
           </div>
           </div>`,
        showCancelButton: true,
        callback: function (data) {
          self.selectUser = user;
          // 确认
          if (data === 'confirm') {
            let radio = document.getElementsByName('userRole');
            for (let i = 0; i < radio.length; i++) {
              if (radio[i].checked) {
                self.userRole = radio[i].value;
                break;
              }
            }
            self.userStatus = 1;
          } else {  // 取消
            self.userRole = null;
            self.userStatus = 2;
          }
          self.doCheckUser();
        }
      });
    },
    // 初始化数据
    initData () {
      this.pageNum = 1;
      this.pageSize = 20;
    }
  },
  //    computed: mapGetters([
  //        'user'
  //    ]),
  computed: {
    list () {
      console.log(this.$store.getters);
      return this.$store.getters.list;
    }
  },
  watch: {
    // tab切换触发查询
    selected (value, newVal) {
      this.$store.getters.list.list = [];
      this.initData();
      this.getUserList();
    },
    timeLine (value, newVal) {
//      this.topStatus = '';
      for (let i = 0; i < self.$refs.length; i++) {
        this.tabList[i].topStatus = '';
        this.$refs[i].loadmore.onTopLoaded();
      }
    },
    // 搜索内容 过滤数据
    searchText (value, newVal) {
      console.log(newVal);
      for (let i = 0; i < this.userList.length; i++) {

      }
    }
  },
  mounted: function () {
    this.getUserList();
  },
  store: this.$store
};
</script>
