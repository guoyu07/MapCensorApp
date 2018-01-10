<template>
    <div class="page-index">
    </div>
</template>
<script>
export default {
  name: 'page-index',
  data () {
    return {
    };
  },
  methods: {
  },
  mounted: function () {
    if (this.$store.getters.user.username) {
      switch (this.$store.getters.user.role) {
        case 'superManager':
          this.$router.push({path: '/index_super'});
          break;
        case 'manager':
          this.$router.push({path: '/case_list'});
          break;
        case 'worker':
          this.$router.push({path: '/index_worker'});
          break;
        default:
          this.$router.push({path: '/login'});
          break;
      }
    } else {
      this.$router.push({path: '/login'});
    }
  },
  store: this.$store
};
</script>
