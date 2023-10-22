import { AdminController } from '~/api/admin-controller';
import LS from '~/store/constants/LS';

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

  const accessToken = localStorage.getItem(LS.AccessToken);
  adminController.setToken(accessToken);

  inject('adminController', adminController);
};
