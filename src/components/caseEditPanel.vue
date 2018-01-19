<template>
    <div class="edit-panel">
      <div>
        <mt-field label="案例概述" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseSnap"></mt-field>
        <mt-field label="详细描述" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseDesc"></mt-field>
        <mt-field label="解决方案" placeholder="" type="textarea" rows="4" v-model="caseInfo.caseMethod"></mt-field>
        <div class="img-container">
          <viewer :images="caseInfo.images" class="images-list">
            <div class="img-add" v-on:click="showImgSheet(true)">
            </div>
            <div class="images-content" v-for="(src, index) in caseInfo.images">
              <img :src="src" :key="src">
              <div class="close-img">
                <i class="fa fa-close close-icon" v-on:click="remoteImg(index)"></i>
              </div>
            </div>
          </viewer>
        </div>
      </div>
      <div class="bottom-option" v-if="!imageSheet">
        <mt-button class="list-btn danger" v-if="caseInfo.id" @click.native="doDelete">删除</mt-button>
        <mt-button class="list-btn" v-if="!caseInfo.id" @click.native="doCancel">取消</mt-button>
        <mt-button class="list-btn primary" @click.native="doSave">保存</mt-button>
      </div>
      <div class="img-upload-model" v-on:click="showImgSheet(false)" v-if="imageSheet"></div>
      <div :class="{'img-upload-panel': true, 'slideIn': imageSheet, 'slideOut': !imageSheet}">
        <div class="sheet-container">
          <div class="sheet-list">拍照（未实现）</div>
          <div class="sheet-list">
            <vue-core-image-upload
              :class="['img-upload']"
              text="从相册中选择"
              :crop="false"
              @imageuploaded="imageuploaded"
              input-accept="image/*"
              :data="uploadImg"
              :credentials=false
              :max-file-size="5242880"
              :url="uploadUrl" >
            </vue-core-image-upload>
          </div>
          <div class="sheet-list" v-on:click="showImgSheet(false)">取消</div>
        </div>
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
        },
        imageSheet: false  // sheet显示/隐藏
      };
    },
    methods: {
      openImgSource () {
        let imgInput = document.getElementById('#imageUpload');
        imgInput.click();
      },
      imageuploaded (res) {
        this.imageSheet = false;
        if (res && res.errorCode === 0) {
          this.$toast({
            message: res.message,
            position: 'bottom'
          });
          this.caseInfo.images.push(this.app.SERVICE + res.result.data[0]);
        }
      },
      // 图片上传打开sheet
      showImgSheet (flag) {
        this.imageSheet = flag;
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
      .img-add {
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
        background: url('../assets/image_upload.svg') no-repeat center top;
      }
      .img-upload {
      }
      .images-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        float: left;
        width: 100%;
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
              left: 2px;
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
    .img-upload-model {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      transition: all .3s;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }
    .img-upload-panel {
      width: 100%;
      /*height: 200px;*/
      visibility: hidden;
      animation-duration: .3s;
      animation-fill-mode: both;
      border-top: 1px solid #eee;
      background-color: #fff;
      z-index: 2;
      position: fixed;
      bottom: 0;
      .sheet-container {
        .sheet-list {
          padding: 10px 5px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: center;
        }
      }
      &.slideIn {
        animation-name: slideInUp;
      }
      &.slideOut {
        animation-name: slideOutDown;
      }
    }
  }
</style>
<style lang="less">
  @import './../less/case_list.less';
</style>
