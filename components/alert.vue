<template>
  <div>
    <b-alert show fade :variant="variant" style="width: 50vw; font-size: 30px">
      <div class="d-flex justify-content-between align-items-center">
        <div ref="messageDiv"></div>
        <b-button pill :variant="variant" @click="closeAlert">&times;</b-button>
      </div>
    </b-alert>
  </div>
</template>

<script>
import DOMPurify from 'dompurify';

export default {
  name: 'AppAlert',
  props: {
    variant: {
      type: String,
      default: 'info',
    },
    message: {
      type: String,
      default: 'default message',
    },
  },
  mounted() {
    this.renderMessage();
  },
  methods: {
    renderMessage() {
      this.$refs.messageDiv.innerHTML = DOMPurify.sanitize(this.message);
    },
    closeAlert() {
      this.$root.$el.parentNode.removeChild(this.$root.$el);
    },
  },
};
</script>
