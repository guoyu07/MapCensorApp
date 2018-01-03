<template>
    <div class="login">
    	<mt-field v-validate="'required:true'" :state="errors.has('username') || !username ? 'error':'success'" label="账号" name="username" placeholder="账号" v-model="username"></mt-field>
    	<mt-field v-validate="'required'" :state="errors.has('fullName') || !fullName ? 'error':'success'" label="全称" name="fullName" placeholder="全称" v-model="fullName"></mt-field>
    	<mt-field v-validate="'required|email'" :state="errors.has('email') || !email ? 'error':'success'" :class="{'input': true, 'is-danger': errors.has('email') }" label="邮箱" placeholder="邮箱" name="email" type="email" v-model="email"></mt-field>
      <!--<span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>-->
    	<mt-field v-validate="'required'" :state="errors.has('cellPhone') || !cellPhone ? 'error':'success'" label="电话" placeholder="电话" v-model="cellPhone"></mt-field>
    	<mt-field v-validate="'required'" :state="errors.has('company') || !company ? 'error':'success'" label="公司" name="company" placeholder="公司" v-model="company"></mt-field>
    	<mt-field v-validate="'required|confirmed:' + confirmPsw" :state="errors.has('password') || !password || password!=confirmPsw? 'error':'success'" label="密码" name="password" placeholder="密码" type="password" v-model="password"></mt-field>
    	<mt-field v-validate="'required'" :state="errors.has('confirmPsw') || !confirmPsw || password!=confirmPsw ? 'error':'success'" label="确认密码" name="confirmPsw" placeholder="确认密码" type="password" v-model="confirmPsw"></mt-field>
		<mt-button type="primary" size="large" @click="register()">注册</mt-button>
    </div>
</template>
<script>
  export default {
    name: 'register',
    data: function () {
      return {
        username: '',
        password: '',
        company: '',
        cellPhone: '',
        fullName: '',
        email: '',
        confirmPsw: ''
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
            email: () => '请输入正确的邮箱格式',
            required: (field) => '请输入' + field,
            confirmed: (field) => '两次输入的密码不一致'
          },
          attributes: {
            email: '邮箱',
            password: '密码',
            username: '账号',
            cellPhone: '电话',
            fullName: '全称',
            company: '公司',
            confirmPsw: '确认密码'
          }
        };
        self.$validator.localize('zh_CN', dictionary);
      },
      register: function () {
        let obj = {};
        obj.username = this.username || '';
        obj.password = this.password || '';
        obj.company = this.company || '';
        obj.cellPhone = this.cellPhone || '';
        obj.fullName = this.fullName || '';
        obj.email = this.email || '';
        obj.confirmPsw = this.confirmPsw || '';
        this.$validator.validateAll().then((result) => {
          if (result) {
            console.log(result);
            this.$store.dispatch('register', obj);
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
