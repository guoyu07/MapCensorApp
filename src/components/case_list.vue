<template>
    <div class="caseList" style="width: 100%; height: 100%;">
      <div id="mapContainer" style="width: 100%; height: 100%;">
        <i class="fa fa-user menu-left-icon" @click="openMenuBar"></i>
        <mt-search v-model="searchMap" class="map-search-container" @keyup.native="autoCompleteList">
          <mt-cell
            v-for="item in searchAuto" :key="item.id"
            :title="item.title" :label="item.address"
            :value="item.province + ' - ' +  item.city">
          </mt-cell>
        </mt-search>
      </div>
      <mt-palette-button content="+" class="map-add-btn" @expand="main_log('expand')" @expanded="main_log('expanded')" @collapse="main_log('collapse')"
                         direction="t" :radius="80" ref="target_1" mainButtonStyle="color:#fff;background-color:#26a2ff;">
        <div class="fa fa-plus map-palette-btn" @touchstart="sub_log(1)"></div>
        <div class="fa fa-save map-palette-btn" @touchstart="sub_log(2)"></div>
        <div class="fa fa-close map-palette-btn" @touchstart="sub_log(3)"></div>
      </mt-palette-button>
      <div :class="{'poi-list-panel': true, 'slideIn': poiListSheet, 'slideOut': !poiListSheet}">
        <div class="poi-list-container">
          <div class="poi-list-item">
            <div class="poi-list-content">当前位置</div>
            <div class="poi-list-option">
              <i class="fa fa-check"></i>
            </div>
          </div>
          <div class="poi-list-item" @click="selectPoiRow(item)" v-for="item in nearbyPoiList">
            <div class="poi-list-content">{{item.title}}</div>
            <div class="poi-list-option">
              <i class="fa fa-check" v-if="selectPoi && selectPoi.id == item.id"></i>
            </div>
          </div>
        </div>
        <div class="poi-list-btn-group">
          <mt-button size="normal" class="poi-list-btn" @click="changeSheetStatus(false)">关闭</mt-button>
          <mt-button size="primary" class="poi-list-btn" @click="doSavePoi()">确定</mt-button>
        </div>
      </div>
    </div>
</template>
<script>
  import './../less/case_list.less';
  export default {
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
        selectPoi: null
      };
    },
    mounted: function () {
      this.init();
    },
    methods: {
      init () {
        let centerLatlng = new qq.maps.LatLng(39.914850, 116.403765);
        this.centerLatlng = centerLatlng;
        let mapOptions = {
          zoom: 12,
          center: this.centerLatlng,
          mapTypeId: qq.maps.MapTypeId.ROADMAP
        };
        this.map = new qq.maps.Map(document.getElementById('mapContainer'), mapOptions);
        // 比例尺
        this.scaleControl = new qq.maps.ScaleControl({
          align: qq.maps.ALIGN.BOTTOM_right,
          margin: qq.maps.Size(85, 15),
          map: this.map
        });
        let self = this;
        // 添加监听事件
        qq.maps.event.addListener(this.map, 'click', function (event) {
          self.centerLatlng = new qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng());
          if (!self.marker) {
            // marker 标注
            self.marker = new qq.maps.Marker({
              position: self.centerLatlng,
              map: self.map,
              animation: qq.maps.MarkerAnimation.DROP,
              // 设置Marker可拖动
              draggable: true,
              // 自定义Marker图标为大头针样式
              icon: new qq.maps.MarkerImage('./../src/assets/marker_red.png')
            });
          } else {
            self.marker.setPosition(self.centerLatlng);
            self.marker.setAnimation('DROP');
          }
          self.getPoiByGeo();
        });
      },
      // 打开左侧菜单栏
      openMenuBar () {
        console.log('打开左侧菜单');
      },
      main_log (val) {
        if (!this.marker) {
          // marker 标注
          this.marker = new qq.maps.Marker({
            position: this.centerLatlng,
            map: this.map,
            animation: qq.maps.MarkerAnimation.DROP,
            // 设置Marker可拖动
            draggable: true,
            // 自定义Marker图标为大头针样式
            icon: new qq.maps.MarkerImage('./../src/assets/marker_red.png')
          });
        }
//        this.marker.setDraggable(true);
//        this.marker.setAnimation('DOWN');
        console.log('main_log', val);
      },
      sub_log (val) {
        console.log('sub_log', val);
        this.$refs.target_1.collapse();
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
        let searchParam = {
          location: self.centerLatlng.lat + ',' + self.centerLatlng.lng,
          get_poi: type || 1,
          callback: data => {
            console.log(data);
            self.nearbyPoiList = data.result.pois;
            self.poiListSheet = true;
          }
        };
        this.$store.dispatch('geoReverse', searchParam);
      },
      // 底部poi列表状态切换
      changeSheetStatus (status) {
        this.poiListSheet = status;
      },
      // 确定
      doSavePoi () {
        this.poiListSheet = false;
      },
      // 选中底部列表中一条poi
      selectPoiRow (poi) {
        this.centerLatlng = new qq.maps.LatLng(poi.location.lat, poi.location.lng);
        this.selectPoi = poi;
        this.map.panTo(this.centerLatlng);
        this.marker.setAnimation('DOWN');
        this.marker.setPosition(this.centerLatlng);
      }
    }
  };
</script>
