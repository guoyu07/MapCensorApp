<template>
    <div class="edit-panel">
      <div>
        <mt-field label="案例概述" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseSnap"></mt-field>
        <mt-field label="详细描述" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseDesc"></mt-field>
        <mt-field label="解决方案" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseMethod"></mt-field>
      </div>
      <div class="bottom-option">
        <mt-button class="list-btn danger" v-if="caseInfo.id" @click.native="doDelete">删除</mt-button>
        <mt-button class="list-btn" v-if="!caseInfo.id" @click.native="doCancel">取消</mt-button>
        <mt-button class="list-btn primary" @click.native="doSave">保存</mt-button>
      </div>
    </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  export default {
    name: 'caseEditPanel',
    props: [],
    components: {},
    data () {
      return {
      };
    },
    methods: {
      // 关闭详情
      doCancel () {
        this.$router.push('/case_list');
      },
      doDelete () {
        let self = this;
        MessageBox({
          title: '提示',
          message: '确定删除此案例?',
          showCancelButton: true,
          callback (data) {
            if (data === 'confirm') {
              self.caseInfo.callback = function () {
                self.$router.push('/case_list');
                self.$store.getters.map.setCenter(new qq.maps.LatLng(self.caseInfo.marker.coordinates[1], self.caseInfo.marker.coordinates[0]));
              };
              self.$store.dispatch('deleteCase', self.caseInfo);
            }
          }
        });
      },
      doSave () {
        console.log(this.caseInfo);
        let self = this;
        if (this.caseInfo.id) {
          // edit
          this.caseInfo.callback = function () {
            self.$router.push('/case_list');
            self.$store.getters.map.setCenter(new qq.maps.LatLng(this.marker.coordinates[1], this.marker.coordinates[0]));
          };
          this.$store.dispatch('updateCase', this.caseInfo);
        } else {
          this.caseInfo.callback = function (caseRes) {
            console.log(caseRes.marker);
            self.$router.push('/case_list');
            self.$store.getters.map.setCenter(new qq.maps.LatLng(caseRes.marker.coordinates[1], caseRes.marker.coordinates[0]));
          };
          // create
          this.$store.dispatch('createCase', this.caseInfo);
        }
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
