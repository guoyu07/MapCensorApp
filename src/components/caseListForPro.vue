<template>
    <div class="caseList" style="width: 100%; height: 100%;">
      <div class="map-search-header">
        <div class="go-history-btn" @click="goHistory">
          <i class="fa fa-angle-left menu-left-icon"></i>
          返回
        </div>
        <div class="map-search-container">{{selectProject.projectName}}</div>
        <div class="menu-right-container" @click="openCaseList">
          列表
          <i class="fa fa-bars menu-right-icon"></i>
        </div>
      </div>
      <div id="mapContainer" :class="{'set-map': editStatus, 'show-map': !editStatus}"></div>
      <div :class="{'poi-list-panel': true, 'slideIn': caseInfoSheet, 'slideOut': !caseInfoSheet}">
        <div class="poi-list-container">
          <case-info-model></case-info-model>
        </div>
        <div class="case-info-btn-group">
          <mt-button class="case-info-btn danger" @click.native="doPassCase(2)" :disabled="issueInfo.issueStatus == 2">不通过</mt-button>
          <mt-button class="case-info-btn primary" @click.native="doPassCase(1)" :disabled="issueInfo.issueStatus == 1">通过</mt-button>
        </div>
      </div>
      <!--左侧tab列表-->
      <mt-popup
        class="menu-bar-panel"
        v-model="tabMenuPanel"
        :class="{'slideInLeft': tabMenuPanel, 'slideOutRight': !tabMenuPanel}"
        position="left">
        <div v-on:click="routerTo('2')"><mt-cell title="待审核"></mt-cell></div>
        <div v-on:click="routerTo('3,4')"><mt-cell title="已审核"></mt-cell></div>
        <mt-button size="small" class="tab-menu-bottom" @click="layout" type="danger">退出登录</mt-button>
      </mt-popup>
      <!--右侧案例列表-->
      <mt-popup class="case-list-panel" v-if="caseListPanel" v-model="caseListPanel" position="right" :modal="false">
        <case-charge-list-panel v-bind:case-list="caseList" v-on:showMarkerOnMap="showMarkerOnMap" v-on:closeCaseListPanel="closeCaseListPanel"></case-charge-list-panel>
      </mt-popup>
      <!--子路由，匹配审核面板-->
      <!--<router-view></router-view>-->
    </div>
</template>
<script>
  import markerRed from '../assets/marker_red.png';
  import markerBlue from '../assets/marker_blue.png';
  import markerGreen from '../assets/marker_green.png';
  import caseChargeListPanel from './caseChargeListPanel.vue';
  import caseInfoModel from './caseInfoModel.vue';
  import { qqMap } from '../qqMap.js';
  import {mapGetters, mapState} from 'vuex';

  export default {
    components: {
      caseChargeListPanel,
      caseInfoModel
    },
    data () {
      return {
        centerLatlng: null,
        map: null,
        marker: null,
        scaleControl: null,
        searchMap: '', // 搜索条件
        searchAuto: [],
        searchResult: [],  // 搜索结果
        nearbyPoiList: [], // 附近poi结果集
        caseInfoSheet: false,
        selectPoi: null,  // 所选poi
        handMarkPoi: null, // 手动打点
        caseListPanel: false,  // 案例列表面板
//        caseList: [],
        casePageSize: 20,
        casePageNum: 1,  // 案例列表每页显示个数
        tabMenuPanel: false,  // 左侧面板
        caseMarkers: [], // 地图上案例marker
        editStatus: false, // 编辑状态 false：查看 true：新建
        selectCaseMarker: null  // 选中的案例marker
      };
    },
    mounted: function () {
      let self = this;
      qqMap(this.app.TX_KEY).then(qq => {
        self.init(qq);
      });
    },
    methods: {
      init (qq) {
        let self = this;
        let storeMap = this.$store.getters.map;
        if (!storeMap) {
          this.centerLatlng = new qq.maps.LatLng(39.916527, 116.397128);
        } else {
          let centerGeo = storeMap.getCenter();
          this.centerLatlng = new qq.maps.LatLng(centerGeo.lat, centerGeo.lng);
        }
        let mapOptions = {
          zoom: 12,
          center: this.centerLatlng,
          mapTypeId: qq.maps.MapTypeId.ROADMAP
        };
        this.map = new qq.maps.Map(document.getElementById('mapContainer'), mapOptions);
        this.$store.commit('SET_MAP', this.map);
        // 比例尺
        this.scaleControl = new qq.maps.ScaleControl({
          align: qq.maps.ALIGN.BOTTOM_right,
          margin: qq.maps.Size(85, 15),
          map: this.map
        });
        // 地图空白处点击，收起sheet
        qq.maps.event.addListener(this.map, 'click', function () {
          self.editStatus = false;
          self.caseInfoSheet = false;
        });
        this.queryCaseList();
      },
      // 跳转
      goHistory () {
        this.$router.goBack();
      },
      // 查询单个案例详情
      queryCaseInfo (marker) {
        this.caseInfoSheet = true;
        this.editStatus = true;
        this.centerLatlng = this.map.getCenter();
        this.$store.dispatch('queryIssueInfo', marker);
      },
      // 地图上显示marker详情
      showMarkerOnMap (info) {
        this.caseInfoSheet = true;
        this.editStatus = true;
        this.centerLatlng = new qq.maps.LatLng(info.caseMarker.coordinates[1], info.caseMarker.coordinates[0]);
        this.map.setCenter(this.centerLatlng);
        this.$store.commit('SET_ISSUE', info);
//        this.$store.dispatch('queryIssueInfo', info);
      },
      // 创建案例的marker
      createCaseMarker () {
        let self = this;
        if (this.caseList.length) {
          for (let i = 0; i < this.caseList.length; i++) {
            let latLng = new qq.maps.LatLng(this.caseList[i].marker.coordinates[1], this.caseList[i].marker.coordinates[0]);
            this.createMarker(latLng, 'blue', this.caseList[i]);
          }
          // 蓝色marker（案例列表）绑定click事件
          for (let i = 0; i < this.caseMarkers.length; i++) {
            let marker = self.caseMarkers[i];
            qq.maps.event.addListener(marker, 'click', function (data) {
              self.queryCaseInfo(data.target);
            });
          }
        }
      },
      // 查询案例列表
      queryCaseList () {
        let self = this;
        let param = {
          projectCode: self.selectProject.id,
          type: 0,
          callback: data => {
            self.createCaseMarker();
          }
        };
        this.$store.dispatch('getCaseListDetail', param);
      },
      // 初始化marker
      createMarker (latLng, type, issueInfo) {
        let markerLatLng = new qq.maps.LatLng(latLng.getLat(), latLng.getLng());
        let markerType;
        if (type === 'red') {
          markerType = markerRed;
        } else if (type === 'blue') {
          markerType = markerBlue;
        } else {
          markerType = markerGreen;
        }
        // marker 标注
        this.caseMarkers.push(new qq.maps.Marker({
          position: markerLatLng,
          map: this.map,
          animation: qq.maps.MarkerAnimation.DROP,
          // 设置Marker不可拖动
          draggable: false,
          // 自定义Marker图标为大头针样式
          icon: new qq.maps.MarkerImage(markerType),
          issue: issueInfo
        }));
      },
      // 打开左侧菜单栏
      openMenuBar () {
        console.log('打开左侧菜单');
        this.tabMenuPanel = !this.tabMenuPanel;
      },
      // 打开案例列表面板
      openCaseList () {
        this.caseListPanel = !this.caseListPanel;
      },
      // 关闭案例列表面板
      closeCaseListPanel () {
        this.caseListPanel = false;
      },
      // 底部poi列表状态切换
      changeSheetStatus (status) {
        this.caseInfoSheet = status;
        if (!status) {
          this.editStatus = false;
        }
      },
      // 通过/不通过
      doPassCase (type) {
        let self = this;
        if (!this.issueInfo.caseCode) {
          this.$toast({
            message: 'caseCode不能为空',
            position: 'bottom'
          });
          return;
        }
        let param = {
          issueId: this.issueInfo.caseCode,
          callback () {
            self.issueInfo.issueStatus = type;
          }
        };
        param.issueStatus = type;
        this.$store.dispatch('auditIssue', param);
      },
      // 路由跳转待审核已审核
      routerTo (type) {
        this.$router.push({
          name: 'managerIndex',
          params: { type }
        });
      },
      // 退出登录
      layout () {
        this.$store.dispatch('layout');
        this.$router.push({path: '/login'});
      }
    },
    computed: {
      ...mapGetters([
        'caseList', 'selectProject', 'caseInfo', 'issueInfo'
      ])
    },
    watch: {
      // tab切换触发查询
      caseList (value, oldVal) {
        console.log(value, oldVal);
//        this.caseList = value;
        this.createCaseMarker();
        return this.$store.getters.user.caseList;
      }
    }
  };
</script>
<style lang="less">
  @import './../less/case_list.less';
  .caseList {
    .map-search-header {
      position: fixed;
      top: 0;
      height: 40px;
      width: 100%;
      background-color: #26a2ff;
      z-index: 1;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .go-history-btn {
        font-size: 14px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        .menu-left-icon {
          font-size: 23px;
          margin-right: 7px;
        }
      }
      .menu-right-container {
        padding-right: 10px;
        font-size: 14px;
        display: flex;
        align-items: center;
        .menu-right-icon {
          font-size: 23px;
          margin-left: 7px;
        }
      }
    }
    .case-info-btn-group {
      position: fixed;
      display: flex;
      bottom: 0;
      width: 100%;
      background-color: #fff;
      border-top: 1px solid #b6b6b6;
      .case-info-btn {
        width: 50%;
        border-radius: 0;
        background-color: #fff;
        &.primary {
          background-color: #26a2ff;
          color: #fff;
        }
        &.danger {
          background-color: #ef4f4f;
          color: #fff;
        }
      }
    }
  }
</style>
