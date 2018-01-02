<template>
  <div class="censorDlg">
    <div class="img-group">
      <img src="../assets/no_photo.png">
      <img src="../assets/no_photo.png">
      <img src="../assets/no_photo.png">
    </div>
    <div class="content">
      <div>
        <div class="blockDescLiDiv">
          <span>案例概述</span>
        </div>
        <p>案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述案例概述</p>
      </div>
      <div>
        <div class="blockDescLiDiv">
          <span>案例详情</span>
        </div>
        <p>案例详情详情详情案例详情详情详情案例详情详情详情案例详情详情详情案例详情详情详情案例详情详情详情案例详情详情详情案例详情详情详情案例详情详情详情详情</p>
      </div>
      <div>
        <div class="blockDescLiDiv">
          <span>处理方案</span>
        </div>
        <p>处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案处理方案</p>
      </div>
    </div>
    <div class="img-group">
      <img src="../assets/no_photo.png">
      <img src="../assets/no_photo.png">
      <img src="../assets/no_photo.png">
    </div>
    <div class="operator">
      <mt-button type="danger" style="width: 30%;">不通过</mt-button>
      <mt-button type="primary" style="width: 68%;">通过</mt-button>
    </div>
  </div>
</template>

<style scoped>
  .censorDlg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 315px;
    padding-bottom: 41px;
    border-top: 2px solid darkgrey;
    background-color: #ffffff;
  }
  .censorDlg .content {
    height: 173px;
    overflow: auto;
    border-top: 2px solid darkgrey;
    border-bottom: 2px solid darkgrey;
  }
  .censorDlg .img-group img {
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 10px;
    border: 1px solid lightgrey;
    border-radius: 5px;
    padding: 5px;
  }
  .censorDlg .content .blockDescLiDiv {
    display: inline-block;
    vertical-align: top;
    width: 20%;
    margin-left: 10px;
    margin-top: 16px;
  }
  .censorDlg .content p {
    display: inline-block;
    width: 75%;
  }
  .censorDlg .operator {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 41px;
    line-height: 41px;
  }
</style>

<script>
  export default {
    name: 'censorDlg',
    data: function () {
      return {
      };
    },
    methods: {
    }
  };
</script>
