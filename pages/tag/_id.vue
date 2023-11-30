<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  data() {
    return {
      id: this.$route.params.id,
      publicCode: '',
      controlCode: -1,
      isAlreadyInUse: false,
      createdAt: undefined,
      petAddedAt: undefined,
      lastScannedAt: undefined,
    };
  },
  computed: {
    iconName() {
      return this.isAlreadyInUse ? require('@/static/images/tag_in_use.png') : require('@/static/images/tag_not_in_use.png');
    },
    inUseSymbol() {
      return this.isAlreadyInUse ? "🟢" : "⚪";
    },
    formattedCreatedAt() {
      if (!this.createdAt) return "loading...";

      return new Date(this.createdAt).toLocaleDateString('en-US');
    },
    formattedPetAddedAt() {
      if (!this.petAddedAt) return "not added yet";

      return new Date(this.petAddedAt).toLocaleDateString('en-US');
    },
    formattedLastScannedAt() {
      if (!this.lastScannedAt) return "not scanned yet";

      return new Date(this.lastScannedAt).toLocaleDateString('en-US');
    },
  }
})
export default class _id extends Vue {}
</script>

<template>
  <div class="tag-page">
    <div id="alertContainer"></div>

    <div class="head">
      <img class="icon" :src="iconName" alt=""/>
      <h1 class="id">#{{id}}</h1>
    </div>

    <div class="content">
      <b-button variant="primary" class="generate"> <b-icon icon="plus-square-dotted"></b-icon> Generate tag qr code</b-button>
      <b-button variant="primary" class="generate"> <b-icon icon="plus-square-dotted"></b-icon> Generate control qr code</b-button>

      <p>Is already in use: {{ inUseSymbol }}</p>
      <p>Created at: {{ formattedCreatedAt }}</p>
      <p>Pet added at: {{ formattedPetAddedAt }}</p>
      <p>Last scanned at: {{ formattedLastScannedAt }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tag-page {
  margin-top: 13vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.head {
  display: flex;
  flex-direction: column;

  align-items: center;
}

.id {
  font-weight: bolder;
  font-size: 86px;
}

.icon {
  width: 256px;
  height: 256px;
  object-fit: contain;

  margin: 20px;
}

.content {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  font-size: 30px;
}

.generate {
  margin-bottom: 15px;
  font-size: 25px;
  width: 50vw;
}
</style>
