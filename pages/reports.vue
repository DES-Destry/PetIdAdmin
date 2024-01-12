<script lang="ts">
import Vue from 'vue';
import { BTab } from 'bootstrap-vue';
import ReportCard from '~/components/report.vue';
import { Report, ReportsDto } from '~/api/dto/reports.dto';
import { ErrorHandler } from '~/api/error-handler';

export default Vue.extend({
  components: { ReportCard, BTab },
  data: () => {
    return {
      notResolvedReports: [] as Report[],
      resolvedReports: [] as Report[],
    };
  },
  async mounted() {
    const notResolvedResponse = await this.$adminController.getAllReports({
      isResolved: false,
    });
    const resolvedResponse = await this.$adminController.getAllReports({
      isResolved: true,
    });

    const notResolvedData = await ErrorHandler.handleErrorWithModal<ReportsDto>(
      this,
      notResolvedResponse,
    );
    const resolvedData = await ErrorHandler.handleErrorWithModal<ReportsDto>(
      this,
      resolvedResponse,
    );

    if (notResolvedData) this.notResolvedReports = notResolvedData.reports;
    if (resolvedData) this.resolvedReports = resolvedData.reports;
  },
});
</script>

<template>
  <div class="reports-main">
    <div id="alertContainer"></div>
    <h1 class="page-title">Reports</h1>
    <b-tabs class="tabs" content-class="mt-3">
      <b-tab lazy title="Not resolved">
        <div class="report-list">
          <report-card
            v-for="report of notResolvedReports"
            :key="report.id"
            :created-at="report.createdAt"
            :is-resolved="report.isResolved"
            :reporter="report.reporter.username"
            :tag-id="report.corruptedTag.id"
          ></report-card>
        </div>
      </b-tab>
      <b-tab lazy title="Resolved">
        <div class="report-list">
          <report-card
            v-for="report of resolvedReports"
            :key="report.id"
            :created-at="report.createdAt"
            :is-resolved="report.isResolved"
            :reporter="report.reporter.username"
            :resolver="report.resolver.username"
            :tag-id="report.corruptedTag.id"
          ></report-card>
        </div>
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

.report-list {
  margin-bottom: 50px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;

  margin-top: 50px;

  * {
    margin: 15px;
  }
}
</style>
