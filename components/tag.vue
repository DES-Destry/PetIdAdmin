<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TagCard',
  props: {
    id: Number,
    isAlreadyInUse: Boolean,
    createdAt: String,
  },
  computed: {
    inUseSymbol() {
      return this.isAlreadyInUse ? "🟢" : "⚪";
    },
    formattedCreatedAt() {
      if (!this.createdAt) return "Loading...";

      return new Date(this.createdAt).toLocaleDateString('en-US');
    }
  }
});
</script>

<template>
  <div class="tag-card">
    <h1 class="id">#{{id}}</h1>
    <div class="info">
      <p>Is already in use: {{ inUseSymbol }}</p>
      <p>Created at: {{ formattedCreatedAt }}</p>
    </div>
    <b-button variant="primary"><b-icon icon="eye-fill"></b-icon></b-button>
  </div>
</template>

<style scoped lang="scss">
  .tag-card {
    background: #696969;

    border: white solid 1px;
    border-radius: 10px;
    padding: 10px;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 20vw;
  }

  .id {
    font-weight: bolder;
  }

  .info {
    * {
      margin: 0;
    }
  }
</style>
