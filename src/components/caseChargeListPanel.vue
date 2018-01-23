<template>
  <div class="list-panel" style="height: 100%;overflow: auto;position: absolute;">
    <div class="panel-header">
      <mt-button icon="back" type="primary" size="small" v-on:click="closePanel" style="vertical-align: top;margin-left: -81px;padding-top: 5px;">返回</mt-button>
      <mt-search v-model="searchText" class="header-search"></mt-search>
    </div>
    <mt-loadmore class="primary">
      <ul class="cs-ul">
        <li>
          <div class="seq"><span>序号</span></div>
          <div class="description"><span>案例概述</span></div>
          <div class="enclosure"><span>附件数</span></div>
          <div class="status"><span>处理状态</span></div>
        </li>
        <li v-for="(item, index) in filterdCaseList" :key="item.id" v-on:click="showCaseInfo(item)">
          <div class="seq"><span>{{index + 1}}</span></div>
          <div class="description"><span>{{item.caseDesc}}</span></div>
          <div class="enclosure"><span>{{item.caseMediaLength}}</span></div>
          <div class="status">
            <span v-if="item.issueStatus == 0">未审核</span>
            <span v-else-if="item.issueStatus == 1">通过</span>
            <span v-else-if="item.issueStatus == 2">不通过</span>
            <span v-else>未审核</span>
          </div>
          <div style="padding-left: 2%"><i class="fa fa-angle-right "></i></div>
        </li>
      </ul>
    </mt-loadmore>
    <mt-spinner class="load-more-gif" type="triple-bounce" v-show="loading" color="#26a2ff"></mt-spinner>
    <mt-popup v-model="editPanelFlag" position="bottom" :modal="false">
      <case-edit-panel></case-edit-panel>
    </mt-popup>
  </div>
</template>

<script>
  import caseEditPanel from './caseEditPanel.vue';

  export default {
    name: 'caseListPanel',
//    props: ['caseList'],
    components: {
      caseEditPanel
    },
    data: function () {
      return {
        searchText: '',
        editPanelFlag: false,
        pageNum: 1,
        pageSize: 20,
        infiniteLoadingFlag: false,
        topStatus: '',
        loading: false
      };
    },
    methods: {
      showCaseInfo (caseInfo) {
        let self = this;
        let param = {
          issue: caseInfo,
          callback (issue) {
            self.$emit('showMarkerOnMap', issue);
            self.closePanel();
          }
        };
        this.$store.dispatch('queryIssueInfo', param);
      },
      closePanel () {
        this.$emit('closeCaseListPanel');
      },
//      loadTop () {
//        this.pageNum = 1;
//        this.getCaseList();
//      },
//      infiniteLoad () {
//        // 数据未满20*?，不用加载更多
//        if (this.caseList.length < this.pageNum * this.pageSize) {
//          return;
//        }
//        this.loading = true;
//        this.pageNum++;
//        this.getCaseList(1);
//      },
      // 查询列表
      getCaseList (type) {
        let obj = {};
        let self = this;
//        obj.pageNum = this.pageNum;
//        obj.pageSize = this.pageSize;
        obj.type = type;  // 0 刷新 1加载更多
        obj.callback = function () {
          self.topStatus = '';
          self.$refs.loadmore.onTopLoaded();
          self.loading = false;
        };
        this.$store.dispatch('getCaseList', obj);
      }
    },
    watch: {
//      casePageNum (value, oldValue) {
//        this.casePageNum = value;
//        getCaseList(0);
//      }
    },
    computed: {
      caseList () {
        return this.$store.getters.caseList;
      },
      filterdCaseList () {
        return this.caseList.filter((item) => {
          return item.caseDesc.indexOf(this.searchText) !== -1;
        });
      }
    }
  };
</script>

<style lang="less">
  @import './../less/base.less';

  .list-panel {
    .panel-header {
      height: 43px;
      padding: 5px 10px 0 81px;
      background-color: #26a2ff;
      font-size: 0;
      .header-search {
        display: inline-block;
        width: 100%;
        font-size: 14px;
        height: 40px;
        overflow: hidden;
        .mint-searchbar {
          background-color: #26a2ff;
          padding: 0;
          .mint-searchbar-inner {
            padding: 6px 6px 2px;
          }
          .mint-searchbar-cancel {
            color: #ffffff;
          }
        }
      }
    }
    .load-more-gif {
      width: 100%;
      text-align: center;
    }
    .primary {
      padding: 0 10px;
      ul li {
        font-size: 0;
        &:first-child {
          background-color: inherit;
         }
        div {
          display: inline-block;
          font-size: 14px;
          text-align: center;
          vertical-align: top;
        }
        .seq { width: 10%; }
        .description { width: 43%; }
        .enclosure { width: 15%; }
        .status { width: 25%; }
      }
    }
  }
</style>
