<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import QrCreator from 'qr-creator';
import LS from '~/store/constants/LS';

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
            text: this.controlCode,
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
    copyControlQr() {},
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
  },
  async mounted() {
    const tagResponse = await this.$adminController.getTagById(this.id);

    if (!tagResponse) {
      this.$alert('Something went wrong... Real shit is happening', 'danger');
      return;
    }

    if (tagResponse.status === 401) {
      LS.deleteAuthData();
      await this.$router.push('/login?expired=true');

      return;
    }

    if (tagResponse.status !== 200) {
      this.$alert(
        `Something went wrong... Real shit is happening (Status ${tagResponse.status})`,
        'danger',
      );
      return;
    }

    this.publicCode = tagResponse.data.publicCode;
    this.controlCode = tagResponse.data.controlCode;
    this.isAlreadyInUse = tagResponse.data.isAlreadyInUse;
    this.createdAt = tagResponse.data.createdAt;
    this.petAddedAt = tagResponse.data.petAddedAt;
    this.lastScannedAt = tagResponse.data.lastScannedAt;
  },
})
export default class _id extends Vue {}
</script>

<template>
  <div class="tag-page">
    <div id="alertContainer"></div>

    <div class="head">
      <img :src="iconName" alt="" class="icon" />
      <h1 class="id">#{{ id }}</h1>
    </div>

    <div class="content">
      <b-button
        v-b-modal.mainQrModal
        class="generate"
        variant="primary"
        @click="renderMainQr"
      >
        <b-icon icon="plus-square-dotted"></b-icon>
        Generate tag QR code
      </b-button>
      <b-button class="generate" variant="primary">
        <b-icon icon="plus-square-dotted"></b-icon>
        Generate control QR code
      </b-button>

      <p>Is already in use: {{ inUseSymbol }}</p>
      <p>Created at: {{ formattedCreatedAt }}</p>
      <p>Pet added at: {{ formattedPetAddedAt }}</p>
      <p>Last scanned at: {{ formattedLastScannedAt }}</p>
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

.generate {
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
</style>
