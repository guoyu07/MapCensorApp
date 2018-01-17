<template>
  <div class="list-panel">
    <div class="panel-header">
      <mt-button icon="back" type="primary" size="small" v-on:click="closePanel" style="vertical-align: top;margin-left: -81px;padding-top: 5px;">返回</mt-button>
      <mt-search v-model="searchText" class="header-search"></mt-search>
    </div>
    <mt-loadmore class="primary" :top-method="loadTop" ref="loadmore" :maxDistance="90"
                 v-infinite-scroll="infiniteLoad" infinite-scroll-disabled="infiniteLoadingFlag" infinite-scroll-distance="10">
      <ul class="cs-ul">
        <li>
          <div class="seq"><span>序号</span></div>
          <div class="description"><span>案例概述</span></div>
          <div class="enclosure"><span>附件数</span></div>
          <div class="time"><span>创建时间</span></div>
        </li>
        <li v-for="(item, index) in filterdCaseList" :key="item.id" v-on:click="showCaseInfo(item)">
          <div class="seq"><span>{{index + 1}}</span></div>
          <div class="description"><span>{{item.caseDesc}}</span></div>
          <div class="enclosure"><span>{{item.mediaLength}}</span></div>
          <div class="time"><span>{{item.createdAt}}</span></div>
          <div style="padding-left: 2%"><span>&gt;</span></div>
        </li>
      </ul>
    </mt-loadmore>
    <mt-popup v-model="editPanelFlag" position="bottom" :modal="false">
      <case-edit-panel></case-edit-panel>
    </mt-popup>
  </div>
</template>

<script>
  import caseEditPanel from './caseEditPanel.vue';

  export default {
    name: 'caseListPanel',
    props: ['caseList'],
    components: {
      caseEditPanel
    },
    data: function () {
      return {
        searchText: '',
        editPanelFlag: false
      };
    },
    methods: {
      showCaseInfo (caseInfo) {
        let self = this;
        caseInfo.callback = function (data) {
          self.$router.push('/caseEdit');
        };
        this.$store.dispatch('queryCaseInfo', caseInfo);
      },
      closePanel () {
        this.$emit('closeCaseListPanel');
      },
      loadTop () {
        console.log('load top ...');
        this.$refs.loadmore.onTopLoaded();
      },
      infiniteLoad () {

      }
    },
    computed: {
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
        .time { width: 25%; }
      }
    }
  }
</style>
