import { AdminController } from '~/api/admin-controller';

declare module 'vue/types/vue' {
  interface Vue {
    $adminController: AdminController;
  }
}

// @ts-ignore
export default ({ app }, inject) => {
  const baseURL = app?.$config?.apiBaseUrl;
  const axios = app?.$axios.create({ baseURL });
  const adminController = new AdminController(axios);

  inject('adminController', adminController);
};
