<template>
  <div>
    <b-alert
      show
      fade
      dismissible
      :variant="variant"
      style="width: 50vw; font-size: 30px"
    >
      {{ message }}
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
};
</script>
