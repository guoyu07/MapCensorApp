<style media="screen">
  .user-list-cell .mint-cell-title {
    text-align: left;
  }
</style>
<template id="selected">
  <div class="page-tabbar" id="index_super">
    <mt-tab-container class="page-tabbar-container" v-model="selected" swipeable>
      <div class="add-pro-container" v-show="selected == '1,4'" @click="createProject">
        <i class="fa fa-plus-square"></i>
        <span class="text-desc">新建</span>
      </div>
      <mt-tab-container-item :id="item.id" v-for="item in tabList" :key="item.index">
        <mt-loadmore :top-method="loadTopRefresh" :top-status.sync="item.topStatus" ref="loadmore" v-infinite-scroll="loadMoreList"
                     infinite-scroll-disabled="loading" infinite-scroll-distance="10">
          <!--<mt-search v-model="searchText" show>-->
          <div v-on:click="popupInfo(pro)"  v-for="pro in list.list" :key="pro.id">
            <mt-cell-swipe v-if="selected === '1,4'" class="user-list-cell" :title="pro.projectName" :label="pro.projectDesc"
             :right="[{
                content: '删除',
                style: { background: 'red', color: '#fff' },
                handler: () => deleteProject(pro)
                }]" is-link>
              <div v-if="selected === '1,4'">
                  <div style="display: inline-block;">
                    <div style="display: inline-block;">{{Math.round((pro.worked/pro.issueTotal)*10000).toFixed(4)/100}}%</div>
                    <mt-button type="primary" size="small" @click="doSubmitInit(pro, 4, $event)" :disabled="pro.worked !== pro.issueTotal">提交</mt-button>
                  </div>
              </div>
            </mt-cell-swipe>
            <mt-cell-swipe v-else class="user-list-cell" :title="pro.projectName" :label="pro.projectDesc"is-link>
              <div v-if="selected === '2'">
                <div style="display: inline-block;">{{Math.round((pro.worked/pro.issueTotal)*10000).toFixed(4)/100}}%</div>
                <mt-badge v-if="pro.projectStatus === 1" type="warning">{{getProStatus(pro.projectStatus)}}</mt-badge>
                <mt-badge v-if="pro.projectStatus === 2" type="primary">{{getProStatus(pro.projectStatus)}}</mt-badge>
                <mt-badge v-if="pro.projectStatus === 3" type="success">{{getProStatus(pro.projectStatus)}}</mt-badge>
                <mt-badge v-if="pro.projectStatus === 4" type="error">{{getProStatus(pro.projectStatus)}}</mt-badge>
              </div>
            </mt-cell-swipe>
          </div>
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
    <mt-popup class="popup-model" position="right" v-if="selected == '1,4'" popup-transition="popup-fade" v-model="showInfo" modal="true">
      <div class="popup-title">
        <div class="close-popup" @click="popupInfo">
          <span class="mint-button-icon">
            <i class="mintui mintui-back"></i>
          </span>
          <label class="mint-button-text">返回</label>
        </div>
      </div>
      <div class="popup-content">
        <mt-cell title="创建人" :value="selectProject.createUser"></mt-cell>
        <mt-cell title="创建时间" :value="selectProject.createdAt"></mt-cell>
        <mt-cell title="提交时间" :value="selectProject.submitAt"></mt-cell>
        <mt-cell title="案例总数" :value="selectProject.issueTotal"></mt-cell>
        <mt-cell title="已作业" :value="selectProject.audited"></mt-cell>
        <mt-cell title="待作业" :value="selectProject.worked"></mt-cell>
        <mt-cell title="进度">
        </mt-cell>
        <div style="padding: 0 10px;">
          <mt-progress :value="Math.round((selectProject.worked/selectProject.issueTotal)*10000).toFixed(4)/100">
            <div slot="start">{{Math.round((selectProject.worked/selectProject.issueTotal)*10000).toFixed(4)/100}}%</div>
            <div slot="end">100%</div>
          </mt-progress>
        </div>
        <mt-button type="default" style="width: 100%; border-radius: 0;" @click.native="showCaseList">查看案例</mt-button>
      </div>
    </mt-popup>
    <mt-popup class="popup-model" position="right" v-if="selected == '2'" popup-transition="popup-fade" v-model="showInfo" modal="true">
      <div class="popup-title">
        <div class="close-popup" @click="popupInfo">
          <span class="mint-button-icon">
            <i class="mintui mintui-back"></i>
          </span>
          <label class="mint-button-text">返回</label>
        </div>
      </div>
      <div class="popup-content">
        <mt-cell title="创建人" :value="selectProject.createUser"></mt-cell>
        <mt-cell title="创建时间" :value="selectProject.createdAt"></mt-cell>
        <mt-cell title="提交时间" :value="selectProject.submitAt"></mt-cell>
        <mt-cell title="问题总数" :value="selectProject.issueTotal"></mt-cell>
        <mt-cell title="已审核" :value="selectProject.audited"></mt-cell>
        <mt-cell title="待审核" :value="selectProject.worked"></mt-cell>
        <mt-cell title="错误数" :value="selectProject.errorCount"></mt-cell>
        <mt-cell title="进度">
        </mt-cell>
        <div style="padding: 0 10px;">
          <mt-progress :value="Math.round((selectProject.worked/selectProject.issueTotal)*10000).toFixed(4)/100">
            <div slot="start">{{Math.round((selectProject.worked/selectProject.issueTotal)*10000).toFixed(4)/100}}%</div>
            <div slot="end">100%</div>
          </mt-progress>
        </div>
      </div>
    </mt-popup>
    <mt-popup class="popup-model" position="right" v-if="selected == '3'" popup-transition="popup-fade" v-model="showInfo" modal="true">
      <div class="popup-title">
        <div class="close-popup" @click="popupInfo">
          <span class="mint-button-icon">
            <i class="mintui mintui-back"></i>
          </span>
          <label class="mint-button-text">返回</label>
        </div>
      </div>
      <div class="popup-content">
        <mt-cell title="项目编号" :value="selectProject.id"></mt-cell>
        <mt-cell title="项目名称" :value="selectProject.projectName"></mt-cell>
        <mt-cell title="项目描述" :value="selectProject.projectDesc"></mt-cell>
        <mt-cell title="问题数" :value="selectProject.issueTotal"></mt-cell>
        <mt-cell title="提交时间" :value="selectProject.submitAt"></mt-cell>
        <!-- <mt-cell title="审核状态" :value="getProStatus(selectProject.projectStatus)"></mt-cell> -->
        <mt-cell title="审核时间" :value="selectProject.auditedAt"></mt-cell>
      </div>
    </mt-popup>
  </div>
</template>
<script>
  // import {mapGetters} from 'vuex';
//  import {mapGetters, mapState} from 'vuex';
  import Application from './../application.js';
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'index_super',
    data () {
      return {
        selected: '1,4',
        topStatus: '',
        pageNum: 1,
        pageSize: 20,
        timeLine: this.$store.getters.list.timeLine,
        loading: false,
        showInfo: false,
//      searchText: '', // 搜索内容
        tabList: [
          {id: '1,4', name: '待作业', index: 0, topStatus: '', icon: 'fa fa-eye'},
          {id: '2', name: '已提交', index: 1, topStatus: '', icon: 'fa fa-check'},
          {id: '3', name: '已完成', index: 1, topStatus: '', icon: 'fa fa-check-square-o'},
          {id: '-1', name: '案例列表', index: 2, topStatus: '', icon: 'fa fa-list'}
        ],
        projectStatus: '', // 状态
        selectProject: {}
      };
    },
    methods: {
      // 新建项目
      createProject () {
        this.$router.push('/createProject');
      },
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
      // 查看案例列表
      showCaseList () {
        let self = this;
        let param = {
          projectCode: this.selectProject.id,
          callback: function () {
            self.$router.push('/caseListForPro');
          }
        };
        this.$store.dispatch('getListDetail', param);
      },
      // 详情
      popupInfo (project) {
        if (project.id) {
          this.selectProject = project;
          this.$store.commit('SET_PROJECT', project);
        }
        this.showInfo = !this.showInfo;
      },
      // 删除项目
      deleteProject (project) {
        console.log(project);
        let self = this;
        let param = {
          id: project.id,
          callback () {
            self.getProjectList();
          }
        };
        this.$store.dispatch('deleteProject', param);
        // for (let i = 0; i < this.list.list.length; i++) {
        //   if (this.list.list[i].id === project.id) {
        //     this.list.list.splice(i, 1);
        //   }
        // }
      },
      // 项目状态
      getProStatus (type) {
        let result;
        switch (type) {
          case 1:
            result = '未提交';
            break;
          case 2:
            result = '审核中';
            break;
          case 3:
            result = '审核通过';
            break;
          case 4:
            result = '审核不通过';
            break;
          default:
            break;
        }
        return result;
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
      doSubmitInit (pro, status, event) {
        let self = this;
        event.cancelBubble = true;
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
          this.$router.push({ path: '/caseListShow' });
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
      if (this.$router.currentRoute.params.type) {
        this.selected = this.$router.currentRoute.params.type;
      }
      if (this.selected === '-1') {
        this.$router.push({ path: '/caseListShow' });
        return;
      }
      this.getProjectList();
    },
    store: this.$store
  };
</script>
<style lang="less">
  @import './../less/index_main.less';
</style>
