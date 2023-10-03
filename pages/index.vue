<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue'
import LS from '~/store/constants/LS'

export default Vue.extend({
  name: 'Empty',
  mounted() {
    const token = localStorage.getItem(LS.AccessToken)

    if (token) {
      this.$nuxt.$options.$router.push('/profile')
    } else {
      this.$router.push('/login')
    }
  },
})
</script>
