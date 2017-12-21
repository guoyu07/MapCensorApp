<template>
    <div class="login">
    	<mt-field label="账号" placeholder="账号" v-model="username"></mt-field>
    	<mt-field label="全称" placeholder="全称" v-model="fullName"></mt-field>
    	<mt-field label="邮箱" placeholder="邮箱" type="email" v-model="email"></mt-field>
    	<mt-field label="电话" placeholder="电话" v-model="cellPhone"></mt-field>
    	<mt-field label="公司" placeholder="公司" v-model="company"></mt-field>
    	<mt-field label="密码" placeholder="密码" type="password" v-model="password"></mt-field>
    	<mt-field label="确认密码" placeholder="确认密码" type="password" v-model="conformPsw"></mt-field>

		<mt-button type="primary" size="large" @click="register()">注册</mt-button>
    </div>
</template>
<script>
  export default {
    name: 'register',
    data: function () {
      return {
        username: this.username,
        password: this.password,
        company: this.company,
        cellPhone: this.cellPhone,
        fullName: this.fullName,
        email: this.email,
        conformPsw: this.conformPsw
      };
    },
    methods: {
      register: function () {
        let obj = {};
        obj.username = this.username || '';
        obj.password = this.password || '';
        obj.company = this.company || '';
        obj.cellPhone = this.cellPhone || '';
        obj.fullName = this.fullName || '';
        obj.email = this.email || '';
        obj.conformPsw = this.conformPsw || '';
        this.$store.dispatch('register', obj);
      }
    }
  };
</script>
