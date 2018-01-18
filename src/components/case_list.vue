<template>
    <div class="caseList" style="width: 100%; height: 100%;">
      <div class="map-search-div">
        <i class="fa fa-user menu-left-icon" @click="openMenuBar"></i>
        <mt-search v-model="searchMap" class="map-search-container" placeholder="搜索地点" @keyup.native="autoCompleteList">
          <div v-for="item in searchAuto" v-on:click="searchPoiByTitle(item)" :key="item.id">
            <mt-cell
              :title="item.title" :label="item.address"
              :value="item.province + ' - ' +  item.city">
            </mt-cell>
          </div>
        </mt-search>
        <div class="menu-right-container" @click="openCaseList">
          <i class="fa fa-bars menu-right-icon"></i>
        </div>
      </div>
      <div id="mapContainer" :class="{'set-map': editStatus, 'show-map': !editStatus}">
        <div :class="{'center-marker': true, 'bounce': !searchMap && editStatus}" v-if="!searchMap && editStatus"></div>
      </div>
      <!--创建marker按钮-->
      <div class="map-add-btn" v-on:click="createCase">
        <i class="fa fa-plus"></i>
      </div>
      <div :class="{'poi-list-panel': true, 'slideIn': poiListSheet, 'slideOut': !poiListSheet}">
        <div class="poi-list-container">
          <div class="poi-list-item poi-list-now" v-if="handMarkPoi && handMarkPoi.title" @click="selectPoiRow(handMarkPoi)">
            <div class="poi-list-title">{{handMarkPoi.title}}</div>
            <div class="poi-list-option">
              <i class="fa fa-check" v-if="selectPoi && selectPoi.id == -1"></i>
            </div>
          </div>
          <div class="poi-list-item" @click="selectPoiRow(item)" v-for="item in nearbyPoiList">
            <div class="poi-list-content">
              <div class="poi-list-title">{{item.title}}</div>
              <div class="poi-list-address">{{item.address}}</div>
            </div>
            <div class="poi-list-option">
              <i class="fa fa-check" v-if="selectPoi && selectPoi.id == item.id"></i>
            </div>
          </div>
        </div>
        <div class="poi-list-btn-group">
          <mt-button class="poi-list-btn" @click.native="changeSheetStatus(false)">关闭</mt-button>
          <mt-button class="poi-list-btn primary" @click.native="doSavePoi()">确定</mt-button>
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
        <!--<div v-on:click="showCaseInfo(item)"></div>-->
        <case-list-panel v-bind:case-list="caseList" v-on:closeCaseListPanel="closeCaseListPanel"></case-list-panel>
      </mt-popup>
      <!--子路由，匹配审核面板-->
      <!--<router-view></router-view>-->
    </div>
</template>
<script>
  import markerRed from '../assets/marker_red.png';
  import markerBlue from '../assets/marker_blue.png';
  import markerGreen from '../assets/marker_green.png';
  import caseListPanel from './caseListPanel.vue';
  import { qqMap } from '../qqMap.js';
  import {mapGetters, mapState} from 'vuex';

  export default {
    components: {
      caseListPanel
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
        poiListSheet: false,
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
        let self = this;
        // 拖动地图
        qq.maps.event.addListener(this.map, 'dragend', function () {
//          self.initMarker(self.map.getCenter(), 'red');
          self.centerLatlng = self.map.getCenter();
          self.map.setCenter(self.map.getCenter());
          self.getPoiByGeo();
        });
        this.queryCaseList();
      },
      // 查询单个案例详情
      queryCaseInfo (marker) {
        let self = this;
        marker.callback = function (data) {
          self.$router.push('/caseEdit');
        };
        this.$store.dispatch('queryCaseInfo', marker);
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
          // 默认全部加载
//          pageSize: this.casePageSize,
//          pageNum: this.casePageNum,
          type: 0,
          callback: data => {
//            self.caseList = data.data;
//            self.$store.commit('GET_CASE_LIST', self.caseList);
            self.createCaseMarker();
          }
        };
        this.$store.dispatch('getCaseList', param);
      },
      // 初始化marker
      createMarker (latLng, type, caseInfo) {
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
          id: caseInfo.id // 案例id
        }));
      },
      // 创建marker
      createCase () {
        this.editStatus = true;
        this.centerLatlng = this.map.getCenter();
        this.getPoiByGeo();
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
      // 搜索提示
      autoCompleteList () {
        let self = this;
        let searchParam = {
          keyword: this.searchMap,
          callback: data => {
            console.log(data);
            self.searchAuto = data.data;
          }
        };
        this.$store.dispatch('autoCompleteList', searchParam);
      },
      // 通过geo查询附近poi
      getPoiByGeo (type) {
        let self = this;
        if (!this.editStatus) {
          return;
        }
        let searchParam = {
          location: self.centerLatlng.lat + ',' + self.centerLatlng.lng,
          get_poi: type || 1,
          callback: data => {
            console.log(data);
            if (data.result.formatted_addresses) {
              let poi = {
                address: data.result.address,
                title: data.result.formatted_addresses.recommend,
                id: -1,
                location: data.result.location
              };
              self.nearbyPoiList = data.result.pois;
              self.poiListSheet = true;
              self.selectPoi = poi;
              self.handMarkPoi = poi;
            } else {
              self.nearbyPoiList = [];
              self.selectPoi = {
                id: -1,
                location: self.centerLatlng
              };
              self.handMarkPoi = null;
            }
          }
        };
        this.$store.dispatch('geoReverse', searchParam);
      },
      // 底部poi列表状态切换
      changeSheetStatus (status) {
        this.poiListSheet = status;
        if (!status) {
          this.editStatus = false;
        }
      },
      // 确定
      doSavePoi () {
        this.poiListSheet = false;
        this.$store.commit('SET_CASE', {
          marker: {
            type: 'Point',
            coordinates: [this.selectPoi.location.lng, this.selectPoi.location.lat]
          }
        });
        this.$router.push('/caseEdit');
        console.log(this.selectPoi);
      },
      // 选中底部列表中一条poi
      selectPoiRow (poi) {
        this.centerLatlng = new qq.maps.LatLng(poi.location.lat, poi.location.lng);
        this.selectPoi = poi;
//        this.initMarker(this.centerLatlng, 'red');
        this.map.panTo(this.centerLatlng);
      },
      // 根据名称搜索poi
      searchPoiByTitle (item) {
        let self = this;
        this.$indicator.open({
          text: '加载中',
          spinnerType: 'triple-bounce'
        });
        let param = {
          keyword: item.title,
          boundary: 'region(' + item.city + ',1)',
          callback: data => {
            console.log(data);
            this.$indicator.close();
            self.nearbyPoiList = data.data;
            self.searchAuto = [];
            self.searchMap = '';
            item.id = -1;
            self.handMarkPoi = item;
            self.selectPoi = self.handMarkPoi;
            self.centerLatlng = new qq.maps.LatLng(self.selectPoi.location.lat, self.selectPoi.location.lng);
            self.map.setCenter(self.centerLatlng);
            if (!this.editStatus) {
              self.poiListSheet = false;
            } else {
              self.poiListSheet = true;
            }
          }
        };
        this.$store.dispatch('searchPoiByTitle', param);
      },
      // 展示案例详情
      showCaseInfo (item) {
        console.log(item);
        this.centerLatlng = new qq.maps.LatLng(item.marker.coordinates[1], item.marker.coordinates[0]);
        if (!this.selectCaseMarker) {
          this.selectCaseMarker = new qq.maps.Marker({
            position: this.centerLatlng,
            map: this.map,
            animation: qq.maps.MarkerAnimation.DROP,
            // 设置Marker可拖动
            draggable: true,
            // 自定义Marker图标为大头针样式
            icon: new qq.maps.MarkerImage(markerGreen)
          });
        } else {
          this.selectCaseMarker.setPosition(this.centerLatlng);
        }
        this.map.setCenter(this.centerLatlng);
        this.selectCaseMarker.setZIndex(3);
        this.caseListPanel = false;
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
        'caseList'
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
</style>
