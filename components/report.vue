<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ReportCard',
  props: {
    tagId: Number,
    reporter: String,
    resolver: String,
    isResolved: Boolean,
    createdAt: String,
  },
  computed: {
    inUseSymbol() {
      return this.isAlreadyInUse ? '🟢' : '⚪';
    },
    formattedCreatedAt() {
      if (!this.createdAt) return 'Loading...';

      return new Date(this.createdAt).toLocaleDateString('en-US');
    },
  },
  methods: {
    openTagPage() {
      this.$router.push(`/tag/${this.id}`);
    },
  },
});
</script>

<template>
  <div class="report-card-main">
    <div v-if="!isResolved" class="report-card">
      <h1 class="id">#{{ tagId }}</h1>
      <div class="info">
        <p>Created by: {{ reporter }}</p>
        <p>Created at: {{ formattedCreatedAt }}</p>
      </div>
      <b-button variant="primary" @click="openTagPage">
        <b-icon icon="eye-fill"></b-icon>
      </b-button>
    </div>

    <div v-if="isResolved" class="report-resolved-card">
      <h1 class="id">#{{ tagId }}</h1>
      <div class="info">
        <p>Created by: {{ reporter }}</p>
        <p>Resolved by: {{ resolver }}</p>
      </div>
      <b-button variant="primary" @click="openTagPage">
        <b-icon icon="eye-fill"></b-icon>
      </b-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.report-card {
  background: #696969;

  border: darkred solid 3px;
  border-radius: 10px;
  padding: 10px;

  font-size: 18px;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 20vw;
}

.report-resolved-card {
  background: #696969;

  border: green solid 3px;
  border-radius: 10px;
  padding: 10px;

  font-size: 18px;
  color: #aaaaaa;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 20vw;
}

.id {
  font-weight: bolder;
}

.report-resolved-card .id {
  text-decoration: line-through;
}

.info {
  * {
    margin: 0;
  }
}
</style>
