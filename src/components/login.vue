<template>
    <div class="login">
    	<mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
    	<mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>

		<mt-button type="primary" size="large" @click="save()">登录</mt-button>
    </div>
</template>

<script>
  export default {
    name: 'login',
    data: function () {
      return {
        username: this.username,
        password: this.password
      };
    },
    methods: {
      save () {
        let obj = {};
        obj.username = this.username || '';
        obj.password = this.password || '';
        this.$store.dispatch('login', obj);
        // 调用action发送请求
      }
    }
  };
</script>
