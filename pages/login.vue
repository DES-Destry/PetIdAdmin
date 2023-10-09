<script lang="ts">
import '~/plugins/api';
import Vue from 'vue';
import LS from '~/store/constants/LS';

export default Vue.extend({
  props: {
    expired: {
      type: Boolean,
      default: false,
    },
  },

  data: function () {
    return {
      username: '',
      password: '',

      appendAlert(message: string, type: string) {
        const alertPlaceholder = document.getElementById('liveErrorAlert');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
          `<div class="alert alert-${type} alert-dismissible fade show notification" role="alert" style="width: 60vw; font-size: 20px;">`,
          `   <div>${message}</div>`,
          '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
          '</div>',
        ].join('');

        alertPlaceholder?.append(wrapper);
      },
    };
  },
  methods: {
    async login() {
      const response = await this.$adminController.login(this.username, this.password);

      if (response?.status === 200) {
        localStorage.setItem(LS.AccessToken, response.data.accessToken);
        localStorage.setItem(LS.AdminId, response.data.adminId);

        // Go to profile if login is successful
        await this.$router.push('/profile');
        return;
      }

      this.username = '';
      this.password = '';

      // if (response?.status === 401) {
      if (this.username === '') {
        this.appendAlert('Incorrect credentials!', 'danger');
        return;
      }

      this.appendAlert(
        "Something went really wrong... Exit this page forever",
        "danger"
      );
    },
  },
});
</script>

<template>
  <div class="container">
    <div class="top">
      <div id="liveErrorAlert"></div>
      <div
        v-if="expired"
        class="alert alert-danger alert-dismissible fade show notification"
        role="alert"
      >
        Your <strong>15 minutes</strong> session was expired!
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>

      <div class="head">
        <img class="ico" src="@/static/icon.png" alt="fut" />
        <h1 class="title">PetID Management</h1>
      </div>
    </div>

    <form class="log-form">
      <div class="mb-xl-4">
        <label for="usernameInput" class="form-label">Username</label>
        <input
          id="usernameInput"
          v-model="username"
          type="text"
          class="form-control bg-dark text-light"
          aria-describedby="username"
        />
      </div>
      <div class="mb-xl-4">
        <label for="passwordInput" class="form-label">Password</label>
        <input
          id="passwordInput"
          v-model="password"
          type="password"
          class="form-control bg-dark text-light"
        />
      </div>
      <button type="button" class="btn btn-primary login-btn" @click="login">
        Login
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin-top: 2vh;
}

.top {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.notification {
  width: 60vw !important;
  font-size: 20px;
}

.warning-svg {
  height: 25px;
  vertical-align: center;
}

.head {
  display: flex;
  flex-direction: row;
  margin-top: 10vh;
  justify-content: center;
  align-items: center;
}

.ico {
  width: 120px;
  height: 120px;
  border-radius: 25px;
}

.title {
  margin-left: 25px;
  font-weight: 800;
  font-size: 69px;
  vertical-align: center;
}

.form-control {
  font-size: 24px;
}

.log-form {
  font-size: 32px;
  text-align: left;
  margin-top: 10vh;
  margin-left: 15vw;
  margin-right: 15vw;
}

.login-btn {
  font-size: 24px;
  width: 10vw;
}
</style>
