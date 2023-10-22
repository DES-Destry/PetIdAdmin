<script lang="ts">
import Vue from 'vue';
import { HttpStatusCode } from 'axios';
import LS from '~/store/constants/LS';
import ControllerBase from '~/api/controller-base';

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
    };
  },
  mounted() {
    if (this.expired) {
      this.$alert(`Your <strong>10 minutes</strong> session was expired!`, 'danger');
    }
  },
  methods: {
    async login() {
      const response = await this.$adminController.login(
        this.username,
        this.password,
      );

      if (ControllerBase.isSuccess(response?.status)) {
        localStorage.setItem(LS.AccessToken, response.data.accessToken);
        localStorage.setItem(LS.AdminId, response.data.adminId);

        // Go to profile if login is successful
        await this.$router.push('/profile');
        return;
      }

      this.username = '';
      this.password = '';

      if (response?.status === HttpStatusCode.Unauthorized) {
        this.$alert('Incorrect credentials!', 'warning');
        return;
      }

      this.$alert('Something went wrong... Real shit is happening', 'danger');
    },
  },
});
</script>

<template>
  <div id="app" class="container">
    <b-container>
      <div class="top">
        <div id="alertContainer"></div>

        <div class="head">
          <img alt="fut" class="ico" src="@/static/icon.png" />
          <h1 class="title">PetID Management</h1>
        </div>
      </div>

      <form class="log-form">
        <div class="mb-xl-4">
          <label class="form-label" for="usernameInput">Username</label>
          <input
            id="usernameInput"
            v-model="username"
            aria-describedby="username"
            class="form-control bg-dark text-light"
            type="text"
          />
        </div>
        <div class="mb-xl-4">
          <label class="form-label" for="passwordInput">Password</label>
          <input
            id="passwordInput"
            v-model="password"
            class="form-control bg-dark text-light"
            type="password"
          />
        </div>
        <button
          class="btn btn-primary login-btn mb-xl-4"
          type="button"
          @click="login"
        >
          Login
        </button>
      </form>
    </b-container>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin-top: 2vh;
}

.top {
  display: flex;
  flex-direction: column;
  align-items: center;
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

  display: flex;
  flex-direction: column;
  align-items: center;

  div {
    width: 40vw;
  }

  button {
    width: 30vw;
  }
}

.login-btn {
  font-size: 24px;
}
</style>
