<template>
  <div class="list-panel">
    <div class="panel-header">
      <mt-button icon="back" type="primary" size="small" v-on:click="closePanel" style="vertical-align: top;margin-left: -81px;">返回</mt-button>
      <mt-search v-model="searchText" class="header-search"></mt-search>
    </div>
    <div class="primary">
      <ul class="cs-ul">
        <li>
          <div class="seq"><span>序号</span></div>
          <div class="description"><span>案例概述</span></div>
          <div class="enclosure"><span>附件数</span></div>
          <div class="time"><span>创建时间</span></div>
        </li>
        <li v-for="(item, index) in filterdCaseList" :key="item.id">
          <div class="seq"><span>{{index + 1}}</span></div>
          <div class="description"><span>{{item.caseDesc}}</span></div>
          <div class="enclosure"><span>{{item.mediaLength}}</span></div>
          <div class="time"><span>{{item.createdAt}}</span></div>
          <div style="padding-left: 2%"><span>&gt;</span></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'primary',
    props: ['caseList'],
    data: function () {
      return {
        searchText: ''
      };
    },
    methods: {
      closePanel () {
        this.$emit('closeCaseListPanel');
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
