<template>
    <div class="password">
    	<mt-field v-validate="'required:true'" :state="errors.has('username') || !username ? 'error':'success'" label="账号" name="username" placeholder="账号" v-model="username"></mt-field>
    	<mt-field v-validate="'required|confirmed:' + confirmPsw" :state="errors.has('password') || !password || password!=confirmPsw? 'error':'success'" label="新密码" name="password" placeholder="新密码" type="password" v-model="password"></mt-field>
    	<mt-field v-validate="'required'" :state="errors.has('confirmPsw') || !confirmPsw || password!=confirmPsw ? 'error':'success'" label="确认密码" name="confirmPsw" placeholder="确认密码" type="password" v-model="confirmPsw"></mt-field>
      <mt-field label="验证码" v-validate="'required'" name="passport" v-model="passport" :state="errors.has('passport') || !passport ? 'error':'success'" placeholder="验证码">
        <!-- <img src="" height="45px" width="100px"> -->
        <mt-button class="passport-btn" @click="sendPassport" :disabled="sendCapStatus">{{timingText}}</mt-button>
      </mt-field>
    <mt-button type="primary" size="large" @click="save()">确定</mt-button>
    </div>
</template>
<script>
  export default {
    name: 'password',
    data: function () {
      return {
        username: '',
        password: '',
        passport: '',
        confirmPsw: '',
        timingText: '发送验证码到邮箱',
        sendCapStatus: false
      };
    },
    mounted: function () {
      this.init();
    },
    methods: {
      init () {
        let self = this;
        // 自定义validate
        const dictionary = {
          messages: {
            required: (field) => '请输入' + field,
            confirmed: (field) => '两次输入的密码不一致'
          },
          attributes: {
            password: '密码',
            username: '账号',
            confirmPsw: '确认密码',
            passport: '验证码'
          }
        };
        self.$validator.localize('zh_CN', dictionary);
      },
      // 获取验证码
      getPassPort () {
        let self = this;
        let param = {
          userName: self.username,
          callback (data) {
            console.log(data);
          }
        };
        this.$store.dispatch('getPassport', param);
      },
      // 倒计时
      sendPassport () {
        this.sendCapStatus = true;
        let time = 30;
        let self = this;
        this.getPassPort();
        let clock = setInterval(() => {
          if (time) {
            time--;
            self.timingText = time;
          } else {
            self.timingText = '发送验证码到邮箱';
            self.sendCapStatus = false;
            clearInterval(clock);
          }
        }, 1000);
      },
      save: function () {
        let obj = {};
        let self = this;
        obj.username = this.username;
        obj.password = this.password;
        obj.passport = this.passport;
        obj.callback = function () {
          self.$router.push('/login');
        };
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$store.dispatch('resetPwd', obj);
          } else {
            if (this.errors.all().length) {
              this.$toast({
                message: this.errors.all()[0],
                position: 'bottom'
              });
            }
          }
        });
      }
    }
  };
</script>
<style lang="less">
  .passport-btn {
    font-size: 12px;
    padding: 5px;
    border-radius: 0;
    width: 80px;
    margin-left: 5px;
  }
</style>
