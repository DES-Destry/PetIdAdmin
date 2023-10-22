<template>
  <div>
    <b-alert show fade :variant="variant" style="width: 50vw; font-size: 30px">
      <div class="d-flex justify-content-between align-items-center">
        <div>{{ message }}</div>
        <b-button :variant="variant" @click="closeAlert">&times;</b-button>
      </div>
    </b-alert>
  </div>
</template>

<script>
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
  methods: {
    closeAlert() {
      this.$root.$el.parentNode.removeChild(this.$root.$el);
    },
  },
};
</script>
