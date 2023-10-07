<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue';
import LS from '~/store/constants/LS';
import { AdminController } from '~/api/admin-controller';

export default Vue.extend({
  name: 'Empty',
  mounted() {
    const token = localStorage.getItem(LS.AccessToken);
    AdminController.setToken(token);

    if (token) {
      this.$nuxt.$options.$router.push('/profile');
    } else {
      this.$router.push('/login');
    }
  },
});
</script>
