<template>
    <div class="edit-panel">
      <div>
        <mt-field label="案例概述" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseSnap"></mt-field>
        <mt-field label="详细描述" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseDesc"></mt-field>
        <mt-field label="解决方案" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseMethod"></mt-field>
      </div>
      <div class="bottom-option">
        <mt-button class="list-btn danger" @click.native="doDelete">删除</mt-button>
        <mt-button class="list-btn primary" @click.native="doSave">保存</mt-button>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'caseEditPanel',
    props: [],
    components: {},
    data () {
      return {
      };
    },
    methods: {
      doDelete () {
        console.log('delete');
      },
      doSave () {
        console.log(this.caseInfo);
        let self = this;
        this.caseInfo.callback = function (caseRes) {
          console.log(caseRes.marker);
          self.$router.push('/case_list');
          self.$store.getters.map.setCenter(new qq.maps.LatLng(caseRes.marker.coordinates[1], caseRes.marker.coordinates[0]));
        };
        this.$store.dispatch('createCase', this.caseInfo);
      }
    },
    computed: {
      caseInfo () {
        return this.$store.getters.caseInfo;
      }
    },
    store: this.$store
  };
</script>

<style lang="less">
  .edit-panel {
    margin-top: 40px;
  }
</style>
