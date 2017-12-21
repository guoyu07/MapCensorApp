<template>
  <div class="app">
		<mt-header title="" fixed>
      <router-link to="/" slot="left" v-if="!user.username">
        <!--<mt-button icon="back">返回</mt-button>-->
    		<img src="./assets/logo.png">
      </router-link>
      <router-link to="/" slot="left" v-if="user.username">
    		<mt-button>{{user.username}}你好</mt-button>
      </router-link>
      <mt-button @click="layout()" slot="right" v-if="user.username">退出</mt-button>
    </mt-header>
    <div v-if="!user.username">
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
      <!-- <router-link v-if="user.role == 'superManager'" to="/index_super"></router-link>
      <router-link v-if="user.role == 'manager'" to="/index_manager"></router-link>
      <router-link v-if="user.role == 'worker'" to="/index_worker"></router-link> -->
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import './less/index.less';

export default {
  name: 'app',
  data () {
    return {
      selected: '1'
    };
  },
  methods: {
    // 退出登录
    layout () {
      this.$store.dispatch('layout');
      this.$router.push({ path: '/login' });
      console.log(this.$store.getters);
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
