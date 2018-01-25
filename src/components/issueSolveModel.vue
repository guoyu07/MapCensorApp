<template>
    <div class="edit-model">
      <div>
        <div class="text-container">
          <div class="text-label">案例编号</div>
          <div class="text-info">{{issueInfo.caseCode}}</div>
        </div>
        <div class="text-container">
          <div class="text-label">案例概述</div>
          <div class="text-info">{{issueInfo.caseSnap}}</div>
        </div>
        <div class="text-container">
          <div class="text-label">详细描述</div>
          <div class="text-info">{{issueInfo.caseDesc}}</div>
        </div>
        <div class="text-container">
          <div class="text-label">解决方案</div>
          <div class="text-info">{{issueInfo.caseMethod}}</div>
        </div>
        <!--<mt-field label="案例编号" placeholder="" type="text" v-model="issueInfo.caseCode"></mt-field>-->
        <!--<mt-field label="案例概述" placeholder="" type="text" v-model="issueInfo.caseSnap"></mt-field>-->
        <!--<mt-field label="详细描述" placeholder="" type="text" v-model="issueInfo.caseDesc"></mt-field>-->
        <!--<mt-field label="解决方案" placeholder="" type="text" v-model="issueInfo.caseMethod"></mt-field>-->
        <div class="img-container text-container" v-if="issueInfo.caseImages.length">
          <viewer :images="issueInfo.caseImages" class="images-list">
            <div class="images-content" v-for="(src, index) in issueInfo.caseImages">
              <img :src="src" :key="src">
            </div>
          </viewer>
        </div>
        <div class="img-container text-container">
          <viewer :images="issueInfo.issueImages" class="images-list">
            <div class="img-add" v-on:click="showImgSheet(true)">
            </div>
            <div class="images-content" v-for="(src, index) in issueInfo.issueImages">
              <img :src="src" :key="src">
              <div class="close-img">
                <i class="fa fa-close close-icon" v-on:click="remoteImg(index)"></i>
              </div>
            </div>
          </viewer>
        </div>
      </div>
      <div class="bottom-option" v-if="!imageSheet" style="left: 0;">
        <mt-button class="list-btn" @click.native="doCancel">取消</mt-button>
        <mt-button class="list-btn primary" @click.native="doSave">保存</mt-button>
      </div>
      <div class="img-upload-model" v-on:click="showImgSheet(false)" v-if="imageSheet"></div>
      <div :class="{'img-upload-panel': true, 'slideIn': imageSheet, 'slideOut': !imageSheet}" style="left: 0;">
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
  import {mapGetters, mapState} from 'vuex';
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
      // 关闭详情
      doCancel () {
        this.$router.push('/case_list');
      },
      // 删除图片
      remoteImg (index) {
        console.log(index);
        this.issueInfo.caseImages.splice(index, 1);
      },
      // 图片上传打开sheet
      showImgSheet (flag) {
        this.imageSheet = flag;
      },
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
          this.issueInfo.issueImages.push(this.app.SERVICE + res.result.data[0]);
        }
      },
      // 查询列表
      getCaseList () {
        let obj = {};
        let self = this;
        obj.projectCode = this.selectProject.id
        this.$store.dispatch('getCaseListDetail', obj);
      },
      doSave () {
        console.log(this.issueInfo);
        let self = this;
        let param = {
          caseCode: this.issueInfo.caseCode,
          proCode: this.selectProject.id,
          images: this.issueInfo.issueImages,
          videos: this.videos,
          callback () {
            self.getCaseList();
          }
        };
        // create
        this.$store.dispatch('createIssue', param);
      }
    },
    computed: {
      ...mapGetters([
        'selectProject', 'caseInfo', 'issueInfo'
      ])
    },
    store: this.$store
  };
</script>

<style lang="less">
  .edit-model {
    .img-container {
      .img-add {
        width: 15%;
        height: 40px;
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
          width: 15%;
          padding: 3px;
          border: 1px solid #d9d9d9;
          margin: 3px;
          border-radius: 3px;
          transition: all .3s;
          height: 40px;
          .close-img {
            width: 0;
            height: 0;
            border-top: 30px solid #26a2ff;
            border-right: 30px solid transparent;
            position: relative;
            top: -47px;
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
            height: 40px;
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
    .text-container {
      display: flex;
      min-height: 40px;
      align-items: center;
      padding: 0 10px;
      border-bottom: 1px solid #d9d9d9;
      .text-label {
        width: 30%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .text-info {
        width: 70%;
        word-wrap: break-word;
      }
    }
  }
</style>
<style lang="less">
  @import './../less/case_list.less';
</style>
