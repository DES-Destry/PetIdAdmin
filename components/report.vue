<script lang="ts">
import Vue from 'vue';
import { ErrorHandler } from '~/api/error-handler';
import { VoidResponseDto } from '~/api/dto/void-response.dto';
import LS from '~/store/constants/LS';

export default Vue.extend({
  name: 'ReportCard',
  props: {
    id: {
      type: String,
      default: '',
    },
    tagId: {
      type: Number,
      default: 0,
    },
    reporter: {
      type: String,
      default: 'loading...',
    },
    resolver: {
      type: String,
      default: 'none',
    },
    isResolved: Boolean,
    createdAt: {
      type: String,
      default: '',
    },
    isResolvable: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      isResolvedState: this.isResolved,
      resolverState: this.resolver,
    };
  },
  computed: {
    formattedCreatedAt() {
      if (!this.createdAt) return 'Loading...';
      return new Date(this.createdAt).toLocaleDateString('en-US');
    },
  },
  methods: {
    openTagPage() {
      this.$router.push(`/tag/${this.tagId}`);
    },
    async resolveReport() {
      const resolveResponse = await this.$adminController.resolveReport(
        this.id,
      );
      const result = await ErrorHandler.handleErrorWithModal<VoidResponseDto>(
        this,
        resolveResponse,
      );

      if (result?.isExecuted) {
        this.isResolvedState = true;
        this.resolverState = localStorage.getItem(LS.AdminId);
      }
    },
  },
});
</script>

<template>
  <div class="report-card-main">
    <div v-if="!isResolvedState" class="report-card">
      <h1 class="id">#{{ tagId }}</h1>
      <div class="info">
        <p>Created by: {{ reporter }}</p>
        <p>Created at: {{ formattedCreatedAt }}</p>
      </div>
      <b-button v-if="isResolvable" variant="success" @click="resolveReport">
        <b-icon icon="check-all"></b-icon>
      </b-button>
      <b-button v-if="!isResolvable" variant="primary" @click="openTagPage">
        <b-icon icon="eye-fill"></b-icon>
      </b-button>
    </div>

    <div v-if="isResolvedState" class="report-resolved-card">
      <h1 class="id">#{{ tagId }}</h1>
      <div class="info">
        <p>Created by: {{ reporter }}</p>
        <p>Resolved by: {{ resolverState }}</p>
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

  border: red solid 3px;
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
