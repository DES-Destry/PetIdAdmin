<script lang="ts">
import Vue from 'vue';
import QrCreator from 'qr-creator';
import { Report, ReportsDto } from '~/api/dto/reports.dto';
import ReportCard from '~/components/report.vue';
import { ErrorHandler } from '~/api/error-handler';
import { TagFullInfoDto } from '~/api/dto/tag.dto';

export default Vue.extend({
  components: { ReportCard },
  data() {
    return {
      id: this.$route.params.id,
      publicCode: '',
      controlCode: -1,
      isAlreadyInUse: false,
      createdAt: null,
      petAddedAt: null,
      lastScannedAt: null,

      isNotFound: true,
      reports: [] as Report[],

      clearTagIdConfirmation: '',
    };
  },
  computed: {
    idString() {
      return this.isNotFound ? 'Not found' : `#${this.id}`;
    },
    iconName() {
      if (this.isNotFound) return require('@/static/images/not_found.png');

      return this.isAlreadyInUse
        ? require('@/static/images/tag_in_use.png')
        : require('@/static/images/tag_not_in_use.png');
    },
    inUseSymbol() {
      return this.isAlreadyInUse ? '🟢' : '⚪';
    },
    formattedCreatedAt() {
      if (!this.createdAt) return 'loading...';
      return new Date(this.createdAt).toLocaleDateString('en-US');
    },
    formattedPetAddedAt() {
      if (!this.petAddedAt) return 'not added yet';
      return new Date(this.petAddedAt).toLocaleDateString('en-US');
    },
    formattedLastScannedAt() {
      if (!this.lastScannedAt) return 'not scanned yet';
      return new Date(this.lastScannedAt).toLocaleDateString('en-US');
    },
    isClearAvailable() {
      return this.id.toString() === this.clearTagIdConfirmation;
    },
  },
  async mounted() {
    const tagResponse = await this.$adminController.getTagById(this.id);
    const reportsResponse = await this.$adminController.getAllReports({
      tagId: this.id,
    });

    const tagData = await ErrorHandler.handleErrorWithModal<TagFullInfoDto>(
      this,
      tagResponse,
      { 404: () => null },
    );

    const reportsData = await ErrorHandler.handleErrorWithModal<ReportsDto>(
      this,
      reportsResponse,
    );

    if (tagData) {
      this.isNotFound = false;
      this.publicCode = tagData.publicCode;
      this.controlCode = tagData.controlCode;
      this.isAlreadyInUse = tagData.isAlreadyInUse;
      this.createdAt = tagData.createdAt;
      this.petAddedAt = tagData.petAddedAt;
      this.lastScannedAt = tagData.lastScannedAt;
    }

    if (reportsData) this.reports = reportsData.reports;
  },
  methods: {
    renderMainQr() {
      const qrFrame = document.getElementById('mainQr');

      if (qrFrame) {
        qrFrame.innerHTML = '';

        QrCreator.render(
          {
            text: `${this.$config.frontendUrl}/pet/${this.publicCode}`,
            radius: 0.4,
            ecLevel: 'H',
            fill: '#000',
            background: null,
            size: 512,
          },
          qrFrame,
        );
      }
    },
    renderControlQr() {
      const qrFrame = document.getElementById('controlQr');

      if (qrFrame) {
        qrFrame.innerHTML = '';

        QrCreator.render(
          {
            text: this.controlCode.toString(),
            radius: 0.4,
            ecLevel: 'H',
            fill: '#000',
            background: null,
            size: 512,
          },
          qrFrame,
        );
      }
    },
    async copyMainQr() {
      const canvas = document.querySelector(
        '#mainQr canvas',
      ) as HTMLCanvasElement;

      if (!canvas) {
        this.$alert('Render QR code first!', 'danger', 'mainQrAlertContainer');
        return;
      }

      const format = 'image/png';

      try {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), format),
        );

        if (blob) {
          const clipboardItem = new ClipboardItem(
            { [format]: blob },
            { presentationStyle: 'attachment' },
          );

          await navigator.clipboard.write([clipboardItem]);
          this.$alert(
            'QR Copied to your clipboard',
            'success',
            'mainQrAlertContainer',
          );
        } else {
          this.$alert('Null image error', 'danger', 'mainQrAlertContainer');
        }
      } catch (err: any) {
        this.$alert(err.message, 'danger', 'mainQrAlertContainer');
      }
    },
    async copyControlQr() {
      const canvas = document.querySelector(
        '#controlQr canvas',
      ) as HTMLCanvasElement;

      if (!canvas) {
        this.$alert(
          'Render QR code first!',
          'danger',
          'controlQrAlertContainer',
        );
        return;
      }

      const format = 'image/png';

      try {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), format),
        );

        if (blob) {
          const clipboardItem = new ClipboardItem(
            { [format]: blob },
            { presentationStyle: 'attachment' },
          );

          await navigator.clipboard.write([clipboardItem]);
          this.$alert(
            'QR Copied to your clipboard',
            'success',
            'controlQrAlertContainer',
          );
        } else {
          this.$alert('Null image error', 'danger', 'controlQrAlertContainer');
        }
      } catch (err: any) {
        this.$alert(err.message, 'danger', 'controlQrAlertContainer');
      }
    },
    downloadMainQr() {
      const canvas = document.querySelector(
        '#mainQr canvas',
      ) as HTMLCanvasElement;

      if (!canvas) {
        this.$alert('Render QR code first!', 'danger', 'mainQrAlertContainer');
        return;
      }

      const dataURL = canvas.toDataURL('image/png');

      const a = document.createElement('a');
      a.href = dataURL;
      a.download = `main-qr-${this.id}.png`;
      a.click();
    },
    downloadControlQr() {
      const canvas = document.querySelector(
        '#controlQr canvas',
      ) as HTMLCanvasElement;

      if (!canvas) {
        this.$alert(
          'Render QR code first!',
          'danger',
          'controlQrAlertContainer',
        );
        return;
      }

      const dataURL = canvas.toDataURL('image/png');

      const a = document.createElement('a');
      a.href = dataURL;
      a.download = `control-qr-${this.id}.png`;
      a.click();
    },
    async clearTag() {
      const clearResponse = await this.$adminController.clearTag(this.id);
      await ErrorHandler.handleErrorWithModal(this, clearResponse, {
        403: () => {
          this.$alert(
            `You can't clear tag, that doesn't have not-resolved report!`,
            'warning',
          );
          return null;
        },
      });

      this.clearTagIdConfirmation = '';
    },
  },
});
</script>

<template>
  <div class="tag-page">
    <div id="alertContainer"></div>

    <div class="head">
      <img :src="iconName" alt="" class="icon" />
      <h1 class="id">{{ idString }}</h1>
    </div>

    <div v-if="!isNotFound" class="content">
      <b-button v-b-modal.mainQrModal class="generate" variant="primary">
        <b-icon icon="plus-square-dotted"></b-icon>
        Generate tag QR code
      </b-button>
      <b-button v-b-modal.controlQrModal class="generate" variant="primary">
        <b-icon icon="plus-square-dotted"></b-icon>
        Generate control QR code
      </b-button>
      <b-button
        v-if="isAlreadyInUse"
        v-b-modal.clearModal
        class="clear"
        variant="danger"
      >
        <b-icon icon="trash"></b-icon>
        Clear tag (delete pet)
      </b-button>

      <p>Public code: {{ publicCode }}</p>
      <p>Control code: {{ controlCode }}</p>
      <p>Is already in use: {{ inUseSymbol }}</p>
      <p>Created at: {{ formattedCreatedAt }}</p>
      <p>Pet added at: {{ formattedPetAddedAt }}</p>
      <p>Last scanned at: {{ formattedLastScannedAt }}</p>

      <div class="reports">
        <h1 class="id">Reports of {{ idString }}</h1>
      </div>

      <div class="report-list">
        <report-card
          v-for="report of reports"
          :key="report.id"
          :created-at="report.createdAt"
          :is-resolved="report.isResolved"
          :reporter="report.reporter.username"
          :tag-id="report.corruptedTag.id"
        ></report-card>
      </div>
    </div>

    <b-modal
      id="mainQrModal"
      body-bg-variant="light"
      body-text-variant="dark"
      centered
      class="modal fade qr-modal"
      footer-bg-variant="dark"
      footer-text-variant="light"
      header-bg-variant="primary"
      header-text-variant="light"
      size="xl"
      title="Main QR Code"
    >
      <div class="qr-modal-content">
        <div id="mainQrAlertContainer"></div>

        <section id="mainQr">
          Click on the "Render" button to see a QR code!
          <b-button
            class="render-button"
            variant="success"
            @click="renderMainQr"
          >
            <b-icon icon="image-fill"></b-icon>
            Render
          </b-button>
        </section>

        <p class="example-text">
          Pay attention, this is valid example of code (hex string):
          180402fca5580ed2
        </p>
        <p class="current-value">Current code in QR Code: {{ publicCode }}</p>
      </div>

      <template #modal-footer="{ ok }">
        <b-button variant="primary" @click="downloadMainQr">
          <b-icon icon="download"></b-icon>
          Save as png
        </b-button>
        <b-button variant="primary" @click="copyMainQr">
          <b-icon icon="clipboard-plus"></b-icon>
          Copy in clipboard
        </b-button>
        <b-button variant="primary" @click="ok()">
          <b-icon icon="check-all"></b-icon>
          Ok
        </b-button>
      </template>
    </b-modal>

    <b-modal
      id="controlQrModal"
      body-bg-variant="light"
      body-text-variant="dark"
      centered
      class="modal fade qr-modal"
      footer-bg-variant="dark"
      footer-text-variant="light"
      header-bg-variant="primary"
      header-text-variant="light"
      size="xl"
      title="Control QR Code"
    >
      <div class="qr-modal-content">
        <div id="controlQrAlertContainer"></div>

        <section id="controlQr">
          Click on the "Render" button to see a QR code!
          <b-button
            class="render-button"
            variant="success"
            @click="renderControlQr"
          >
            <b-icon icon="image-fill"></b-icon>
            Render
          </b-button>
        </section>

        <p class="example-text">
          Pay attention, this is valid example of code (UInt64):
          4407682342885487058
        </p>
        <p class="current-value">Current code in QR Code: {{ controlCode }}</p>
      </div>

      <template #modal-footer="{ ok }">
        <b-button variant="primary" @click="downloadControlQr">
          <b-icon icon="download"></b-icon>
          Save as png
        </b-button>
        <b-button variant="primary" @click="copyControlQr">
          <b-icon icon="clipboard-plus"></b-icon>
          Copy in clipboard
        </b-button>
        <b-button variant="primary" @click="ok()">
          <b-icon icon="check-all"></b-icon>
          Ok
        </b-button>
      </template>
    </b-modal>

    <b-modal
      id="clearModal"
      body-bg-variant="dark"
      body-text-variant="light"
      centered
      class="modal fade"
      footer-bg-variant="dark"
      footer-text-variant="light"
      header-bg-variant="primary"
      header-text-variant="light"
      size="s"
      title="Are you sure?"
      @cancel="clearTagIdConfirmation = ''"
    >
      <div class="confirmation-content">
        <div id="clearAlertContainer"></div>

        <div class="form-floating number-input mb-3">
          <label for="floatingId"
            >To clear this tag you must type his ID. ({{ id }})</label
          >
          <input
            id="floatingId"
            v-model="clearTagIdConfirmation"
            class="form-control bg-dark text-light"
            type="number"
          />
        </div>
      </div>

      <template #modal-footer="{ cancel }">
        <b-button variant="primary" @click="cancel()"> Cancel</b-button>
        <b-button
          :disabled="!isClearAvailable"
          variant="danger"
          @click="clearTag"
        >
          <b-icon icon="trash"></b-icon>
          Clear!
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
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

.reports {
  display: flex;
  flex-direction: column;

  align-items: center;
  margin-top: 60px;
}

.report-list {
  margin-bottom: 50px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;

  margin-top: 20px;

  * {
    margin: 15px;
  }
}

.generate,
.clear {
  margin-bottom: 15px;
  font-size: 25px;
  width: 50vw;
}

.qr-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#mainQr,
#controlQr {
  font-size: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.render-button {
  margin-top: 10px;
}

.example-text {
  font-size: 20px;
  margin-top: 40px;
}

.current-value {
  font-size: 20px;
  margin-top: -10px;
}
</style>
