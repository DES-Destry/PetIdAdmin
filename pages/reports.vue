<script lang="ts">
import Vue from 'vue';
import { BTab } from 'bootstrap-vue';
import LS from '~/store/constants/LS';

export default Vue.extend({
  components: { BTab },
  data: () => {
    return {
      resolvedReports: [],
      notResolvedReports: [],
    };
  },
  async mounted() {
    const resolvedResponse = await this.$adminController.getAllReports({
      isResolved: true,
    });
    const notResolvedResponse = await this.$adminController.getAllReports({
      isResolved: false,
    });

    if (!resolvedResponse || !notResolvedResponse) {
      this.$alert('Something went wrong... Real shit is happening', 'danger');
      return;
    }

    if (resolvedResponse.status === 401 || notResolvedResponse.status === 401) {
      LS.deleteAuthData();
      await this.$router.push('/login?expired=true');

      return;
    }

    if (resolvedResponse.status !== 200 || notResolvedResponse.status !== 200) {
      this.$alert(
        `Something went wrong... Real shit is happening (Statuses: ${resolvedResponse.status}, ${notResolvedResponse.status})`,
        'danger',
      );
      return;
    }

    this.resolvedReports = resolvedResponse.data.reports;
    this.notResolvedReports = notResolvedResponse.data.reports;
  },
});
</script>

<template>
  <div class="reports-main">
    <div id="alertContainer"></div>
    <h1 class="page-title">Reports</h1>
    <b-tabs class="tabs" content-class="mt-3">
      <b-tab lazy title="Not resolved">
        <b-alert show>Not resolved</b-alert>
      </b-tab>
      <b-tab lazy title="Resolved">
        <b-alert show>Resolved :V</b-alert>
      </b-tab>
    </b-tabs>
  </div>
</template>

<style lang="scss" scoped>
.reports-main {
  margin-top: 13vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}

.page-title {
  font-weight: bolder;
  font-size: 72px;
}

.tabs {
  width: 65vw;
  font-size: 32px;
}
</style>
