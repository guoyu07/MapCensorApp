<template>
    <div class="create-project">
    	<mt-field name="projectName" label="项目名称" placeholder="请输入项目名称" v-model="projectName"></mt-field>
    	<mt-field name="projectDesc" label="项目描述" type="textarea" rows="4" placeholder="请输入项目描述" v-model="projectDesc"></mt-field>
      <div class="btn-group">
        <mt-button type="default" class="btn" @click="cancel()">取消</mt-button>
        <mt-button type="primary" class="btn" @click="save()">确定</mt-button>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'createPro',
    data: function () {
      return {
        projectName: '',
        projectDesc: ''
      };
    },
    methods: {
      cancel () {
        this.$router.push('/index_worker');
      },
      save () {
        let obj = {};
        let self = this;
        if (!this.projectName || !this.projectDesc) {
          this.$toast({
            message: '项目名称和项目描述不能为空!',
            position: 'bottom'
          });
          return;
        }
        obj.projectName = this.projectName;
        obj.projectDesc = this.projectDesc;
        obj.callback = function () {
          self.$router.push('/index_worker');
        };
        this.$store.dispatch('createProject', obj);
      }
    },
    directives: {
      autoComplete: {
        // 指令的定义
        inserted: function (el) {
          let ele = el.getElementsByTagName('input')[0];
//          ele.focus();
          ele.setAttribute('auto-complete', 'off');
        }
      }
    }
  };
</script>
<style lang="less">
.create-project {
  margin-top: 40px;
  .btn-group {
    position: fixed;
    bottom: 0;
    display: flex;
    width: 100%;
    .btn {
      width: 50%;
      border-radius: 0;
    }
  }
}
</style>
