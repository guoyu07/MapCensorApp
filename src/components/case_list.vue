<template>
    <div class="caseList" style="width: 100%; height: 100%;">
      <div id="container" style="width: 100%; height: 100%;"></div>
    </div>
</template>
<script>
  export default {
    mounted: function () {
      this.init();
    },
    methods: {
      init: function () {
        let myLatlng = new qq.maps.LatLng(31.584617993869276, 120.29067993164062);
        let myOptions = {
          zoom: 12,
          center: myLatlng,
          mapTypeId: qq.maps.MapTypeId.ROADMAP
        };
        let map = new qq.maps.Map(document.getElementById('container'), myOptions);
        // 添加监听事件
        qq.maps.event.addListener(map, 'click', function (event) {
          console.log('您点击的位置为: [' + event.latLng.getLat() + ', ' +
            event.latLng.getLng() + ']');
        });
      }
    }
  };
</script>
