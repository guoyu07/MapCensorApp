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
          <mt-cell class="user-list-cell" :title="pro.projectName" :label="pro.projectDesc" :key="pro.id"  v-for="pro in list.list">
            <div v-if="selected === '2'">
              <mt-button type="primary" size="small" @click="doSubmitInit(pro, 3)">通过</mt-button>
              <mt-button type="danger" size="small" @click="doSubmitInit(pro, 4)">不通过</mt-button>
            </div>
            <!--<div v-if="selected === '3,4'">
              <mt-button type="primary" size="small" @click="doForceInit(user, 99)">强制过期</mt-button>
              <mt-button type="danger" size="small" @click="doForceInit(user, 3)">停用</mt-button>
            </div>-->
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
      <mt-tab-item :id="item.id" :key="item.index" v-for="item in tabList">
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
        selected: '2',
        topStatus: '',
        pageNum: 1,
        pageSize: 20,
        timeLine: this.$store.getters.list.timeLine,
        loading: false,
//      searchText: '', // 搜索内容
        tabList: [
          {id: '2', name: '待审核', index: 0, topStatus: '', icon: 'fa fa-eye'},
          {id: '3,4', name: '已审核', index: 1, topStatus: '', icon: 'fa fa-check'},
          {id: '-1', name: '案例列表', index: 2, topStatus: '', icon: 'fa fa-warning'}
        ],
        projectStatus: '', // 状态
        selectProject: ''
      };
    },
    methods: {
      // 查询列表
      getProjectList (type) {
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
        this.$store.dispatch('getProjectList', obj);
      },
      // 顶部下拉刷新列表
      loadTopRefresh () {
        this.initData();
        for (let i = 0; i < this.tabList.length; i++) {
          this.tabList[i].topStatus = 'loading';
        }
        this.getProjectList();
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
        this.getProjectList(1);
      },
      // 审核调用接口
      doCheckPro () {
        let obj = {};
        let self = this;
        obj.projectStatus = parseInt(this.projectStatus, 10);
        obj.projectId = this.selectProject.id;
        obj.callback = function () {
          self.loadTopRefresh();
        };
        this.$store.dispatch('checkProject', obj);
      },
      // 提交
      doSubmitInit (pro, status) {
        let self = this;
        MessageBox({
          title: '提示',
          message: '确定执行此操作?',
          showCancelButton: true,
          callback (data) {
            self.selectProject = pro;
            if (data === 'confirm') {
              self.projectStatus = status;
            } else {  // 取消
              return;
            }
            self.doCheckPro();
          }
        });
      },
      // 初始化数据
      initData () {
        this.pageNum = 1;
        this.pageSize = 20;
      }
    },
    computed: {
      list () {
        console.log(this.$store.getters);
        return this.$store.getters.list;
      }
    },
    watch: {
      // tab切换触发查询
      selected (value, oldVal) {
        if (value === '-1') {
          this.$router.push({ path: '/case_list' });
          return;
        }
        this.$store.getters.list.list = [];
        this.initData();
        this.getProjectList();
      },
      timeLine (value, oldVal) {
        for (let i = 0; i < self.$refs.length; i++) {
          this.tabList[i].topStatus = '';
          this.$refs[i].loadmore.onTopLoaded();
        }
      }
    },
    mounted: function () {
      if (this.selected === '-1') {
        this.$router.push({ path: '/case_list' });
        return;
      }
      this.getProjectList();
    },
    store: this.$store
  };
</script>
