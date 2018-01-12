<template>
    <div class="login">
    	<mt-field name="username" label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
    	<mt-field name="password" label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>

		<mt-button type="primary" size="large" @click="save()">登录</mt-button>
    </div>
</template>

<script>
  export default {
    name: 'login',
    data: function () {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      save () {
        let obj = {};
        if (!this.username || !this.password) {
          this.$toast({
            message: '用户名和密码不能为空!',
            position: 'bottom'
          });
          return;
        }
        obj.username = this.username || '';
        obj.password = this.password || '';
        this.$store.dispatch('login', obj);
//        this.axios.post('http://192.168.4.189:3000/api/om/user/login', {
//          userName: obj.username,
//          password: obj.password
//        }).then(function (data) {
//          console.log(data);
//        });
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
