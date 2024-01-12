import { AxiosResponse } from 'axios';
import Vue from 'vue';
import LS from '~/store/constants/LS';

export class ErrorHandler {
  static async handleErrorWithModal<T>(
    component: Vue,
    response: AxiosResponse<T, any>,
    customHandlers?: Record<number, () => null>,
    errorContainer: string = undefined,
  ): Promise<T> {
    if (!response) {
      component.$alert(
        'Something went wrong... Real shit is happening',
        'danger',
        errorContainer,
      );
      return null;
    }

    console.log(customHandlers);
    if (customHandlers && customHandlers[response.status])
      return customHandlers[response.status]();

    if (response.status === 401) {
      LS.deleteAuthData();
      await component.$router.push('/login?expired=true');

      return null;
    }

    if (response.status !== 200) {
      component.$alert(
        `Something went wrong... Real shit is happening (Status ${response.status})`,
        'danger',
        errorContainer,
      );

      return null;
    }

    return response.data;
  }
}
