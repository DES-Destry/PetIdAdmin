<template>
  <div></div>
</template>

<script lang="ts">
import '~/plugins/api';
import Vue from 'vue';
import LS from '~/store/constants/LS';

export default Vue.extend({
  name: 'Empty',
  mounted() {
    const token = localStorage.getItem(LS.AccessToken);
    this.$adminController.setToken(token);

    if (token) {
      this.$router.push('/profile');
    } else {
      this.$router.push('/login');
    }
  },
});
</script>
