<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: 'OptionNavigator',
    props: {
      title: {
        type: String,
        default: "",
      },
      page: {
        type: String,
        default: "",
      },
    },
    methods: {
      navigate() {
        this.$router.push({ name: this.page });
      },
    },
  });
</script>

<template>
  <div class="main-nav">
    <h2 class="title">{{ title }}</h2>
    <hr />
    <button
      type="button"
      class="btn btn-success navigate"
      @click="navigate"
    >
      <b-icon icon="arrow-right-circle"></b-icon>
    </button>
  </div>
</template>

<style scoped lang="scss">
.main-nav {
  margin-top: 5px;
  display: flex;
  align-items: stretch;
  width: 100%;
  justify-content: space-between;
}

.navigate {
  width: 10vw;
}
</style>
