interface IAlert {
  show(message: string, type: string, bindingId?: string): void;
}

export class Alert implements IAlert {
  show(message: string, type: string, bindingId = 'liveErrorAlert'): void {
    const alertPlaceholder = document.getElementById(bindingId);
    const wrapper = document.createElement('div');
    // role="alert" style="width: 60vw; font-size: 20px;"
    wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" style="width: 50vw; font-size: 20px;" role="alert">
        <button type="button" class="btn-close close" data-bs-dismiss="alert" data-dismiss="alert" aria-label="Close"></button>
        <div>${message}</div>
    </div>
    `;

    alertPlaceholder?.append(wrapper);
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $alert: IAlert;
  }
}

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ app }, inject) => {
  const alertManager = new Alert();
  inject('alert', alertManager);
};
