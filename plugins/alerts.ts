import Vue from 'vue';
declare module 'vue/types/vue' {
  interface Vue {
    $alert: (message: string, variant: string, bindingId?: string) => void;
  }
}

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ app }, inject) => {
  Vue.component('AppAlert', require('@/components/alert.vue').default);

  const showAlert = (
    message: string,
    variant: string,
    bindingId = 'alertContainer',
  ) => {
    const AlertComponent = Vue.extend({
      render: (h) => h('AppAlert', { props: { message, variant } }),
    });

    const alertInstance = new AlertComponent();
    alertInstance.$mount();

    const alertPlaceholder = document.getElementById(bindingId);

    if (alertPlaceholder) alertPlaceholder.appendChild(alertInstance.$el);
    else document.body.appendChild(alertInstance.$el);
  };

  inject('alert', showAlert);
};
