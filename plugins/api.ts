import { AdminController } from '~/api/admin-controller';

declare module 'vue/types/vue' {
  interface Vue {
    $adminController: AdminController;
  }
}

// @ts-ignore
export default ({ app }, inject) => {
  const baseURL = app?.$config?.apiBaseUrl;
  const adminController = new AdminController(baseURL);

  inject('adminController', adminController);
};
