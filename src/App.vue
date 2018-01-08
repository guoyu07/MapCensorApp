<template>
  <div class="app" id="app">
		<mt-header :title="user.username?user.username:'审图'" fixed>
      <mt-button icon="back" slot="left" v-if="user.username" @click="goHistory">返回</mt-button>
      <!--<router-link to="/" slot="center" v-if="!user.username">
    		<img src="./assets/logo.png">
      </router-link>-->
      <router-link to="/" slot="center" v-if="user.username">
    		<mt-button>{{user.username}}你好</mt-button>
      </router-link>
      <mt-button @click="layout()" slot="right" v-if="user.username">退出</mt-button>
    </mt-header>
    <div v-if="!user.username" style="padding-top: 40px;">
    	<mt-navbar v-model="selected" class="tab-container">
			  <router-link class="tab-title" to="/login">
          <mt-tab-item id="1" class="tab-content">
            登录
          </mt-tab-item>
        </router-link>
        <router-link class="tab-title" to="/register">
          <mt-tab-item id="2" class="tab-content">
            注册
          </mt-tab-item>
        </router-link>
			</mt-navbar>
    </div>
    <div v-else>
    </div>
    <transition :name="transitionName">
      <router-view class="router-view"></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'app',
  data () {
    return {
      selected: '1',
      transitionName: 'slide-left'
    };
  },
  methods: {
    // 退出登录
    layout () {
      this.$store.dispatch('layout');
      this.$router.push({ path: '/login' });
      console.log(this.$store.getters);
    },
    // 跳转
    goHistory () {
//      this.$router.back(-1);
      this.$router.goBack();
      console.log(this.$router);
    }
  },
  // 监听路由的路径，可以通过不同的路径去选择不同的切换效果
  watch: {
    '$route' (to, from) {
      let isBack = this.$router.isBack;  //  监听路由变化时的状态为前进还是后退
      if (isBack) {
        this.transitionName = 'slide-right';
      } else {
        this.transitionName = 'slide-left';
      }
      this.$router.isBack = false;
    }
  },
  computed: {
    // 检测user改变
    user () {
      if (this.$store.getters.user.username) {
        switch (this.$store.getters.user.role) {
          case 'superManager':
            this.$router.push({ path: '/index_super' });
            break;
          case 'manager':
            this.$router.push({ path: '/index_manager' });
            break;
          case 'worker':
            this.$router.push({ path: '/index_worker' });
            break;
          default:
            break;
        }
      } else {
        this.$router.push({ path: '/login' });
      }
      return this.$store.getters.user;
    }
    // user:function(){
    //   return store.user.status
    // }
  },
  store: this.$store
};
</script>
<style lang="less">
  @import './less/index.less';
</style>

