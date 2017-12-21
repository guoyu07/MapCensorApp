<template>
    <div class="page-tabbar">
        <mt-tab-container class="page-tabbar-container" v-model="selected">
            <mt-tab-container-item id="1">
            1111111
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
            2222
            </mt-tab-container-item>
            <mt-tab-container-item id="3">
            33333
            </mt-tab-container-item>
            <mt-tab-container-item id="4">
            44444
            </mt-tab-container-item>
        </mt-tab-container>
        <mt-tabbar v-model="selected">
            <mt-tab-item id="1">
                待作业
            </mt-tab-item>
            <mt-tab-item id="2">
                已提交
            </mt-tab-item>
            <mt-tab-item id="3">
                已完成
            </mt-tab-item>
            <mt-tab-item id="4">
                案例列表
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>
<script>
export default {
  name: 'page-tabbar',
  data () {
    return {
      selected: '1'
    };
  },
  methods: {
  }
};
</script>
