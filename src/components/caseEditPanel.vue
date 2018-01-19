<template>
    <div class="edit-panel">
      <div>
        <mt-field label="案例概述" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseSnap"></mt-field>
        <mt-field label="详细描述" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseDesc"></mt-field>
        <mt-field label="解决方案" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseMethod"></mt-field>
        <div class="img-container">
          <viewer :images="caseInfo.images" class="images-list">
            <vue-core-image-upload
              :class="['img-upload']"
              text="添加图片"
              :crop="false"
              @imageuploaded="imageuploaded"
              :data="uploadImg"
              :credentials=false
              :max-file-size="5242880"
              :url="uploadUrl" >
            </vue-core-image-upload>
            <div class="images-content" v-for="(src, index) in caseInfo.images">
              <img :src="src" :key="src">
              <div class="close-img">
                <i class="fa fa-close close-icon" v-on:click="remoteImg(index)"></i>
              </div>
            </div>
          </viewer>
        </div>
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
  import VueCoreImageUpload from 'vue-core-image-upload';
  export default {
    name: 'caseEditPanel',
    props: [],
    components: {
      'vue-core-image-upload': VueCoreImageUpload
    },
    data () {
      return {
        uploadUrl: this.app.SERVICE_URL + '/bs/case/upload?token=' + this.app.TOKEN,
        uploadImg: {
          path: ''
        }
      };
    },
    methods: {
      imageuploaded (res) {
        if (res && res.errorCode === 0) {
          this.$toast({
            message: res.message,
            position: 'bottom'
          });
          this.caseInfo.images.push(this.app.SERVICE + res.result.data[0]);
        }
      },
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
      // 删除图片
      remoteImg (index) {
        console.log(index);
        this.caseInfo.images.splice(index, 1);
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
    margin-bottom: 40px;
    .img-container {
      .img-upload {
        width: 28%;
        height: 80px;
        margin: 3px;
        float: left;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        transition: all .3s;
        padding: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .images-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .images-content {
          /*display: flex;*/
          width: 28%;
          padding: 3px;
          border: 1px solid #d9d9d9;
          margin: 3px;
          border-radius: 3px;
          transition: all .3s;
          height: 80px;
          .close-img {
            width: 0;
            height: 0;
            border-top: 30px solid #26a2ff;
            border-right: 30px solid transparent;
            position: relative;
            top: -87px;
            left: -3px;
            .close-icon {
              position: relative;
              top: -29px;
              left: 1px;
              color: #ffffff;
            }
          }
          .img-list {

          }
          img {
            width: 100%;
            height: 80px;
            /*padding: 3px;*/
          }
        }
      }
    }
    /* viewer*/
    .viewer-container {
      .viewer-footer {
        .viewer-navbar {
          .viewer-list {
            width: 100% !important;
            display: flex !important;;
            justify-content: center !important;;
          }
        }
      }
    }
  }
</style>
