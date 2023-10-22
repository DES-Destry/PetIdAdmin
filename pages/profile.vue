<script lang="ts">
import Vue from 'vue';
import LS from '~/store/constants/LS';
export default Vue.extend({
  // components: { OptionNavigator },
  data() {
    return {
      username: 'Loading...',
      isNotCapable: true,
      passwordLastChangedAt: new Date(0),
      createdAt: new Date(0),

      oldPassword: '',
      newPassword: '',
      repeatNewPassword: '',
      passwordEditErrorText: '',
      isPasswordSaveButtonDisabled: true,
    };
  },
  computed: {
    passwordInfo() {
      if (this.username === '') return '';

      if (this.passwordLastChangedAt.getTime() === 0) {
        const deletionTime = new Date();
        deletionTime.setDate(this.createdAt.getDate() + 1);
        deletionTime.setSeconds(this.createdAt.getSeconds());
        deletionTime.setMinutes(this.createdAt.getMinutes());
        deletionTime.setHours(this.createdAt.getHours());

        return `This profile hasn't a password - only limited functionality works. SET IT IMMEDIATELY!\n
                Time of account auto-deletion: ${deletionTime.toLocaleString(
                  'en-US',
                )}`;
      }

      return `Password last changed at: ${this.passwordLastChangedAt.toLocaleString(
        'en-US',
      )}`;
    },
    isPasswordSavingAvailable() {
      return this.newPassword !== '' && this.passwordEditErrorText === '';
    },
  },
  // Extract data from token on load
  async mounted() {
    const authResponse = await this.$adminController.auth();

    if (!authResponse) {
      this.$alert('Something went wrong... Real shit is happening', 'danger');
      return;
    }

    if (authResponse.status === 401) {
      LS.deleteAuthData();
      await this.$router.push('/login?expired=true');

      return;
    }

    if (authResponse.status !== 200) {
      this.$alert(
        `Something went wrong... Real shit is happening (Status ${authResponse.status})`,
        'danger',
      );
      return;
    }

    localStorage.setItem(LS.Username, authResponse.data.username);
    localStorage.setItem(
      LS.IsNotCapable,
      String(authResponse?.data.isNotCapable),
    );

    this.username = authResponse.data.username;
    this.isNotCapable = authResponse.data.isNotCapable;
    this.passwordLastChangedAt = new Date(
      authResponse.data.passwordLastChangedAt ?? 0,
    );
    this.createdAt = new Date(authResponse.data.createdAt);
  },
  methods: {
    resetPasswordModal() {
      this.oldPassword = '';
      this.newPassword = '';
      this.repeatNewPassword = '';
      this.passwordEditErrorText = '';
    },
    passwordEditTextsChanged() {
      if (this.newPassword === '') {
        this.passwordEditErrorText = '';
        return;
      }

      if (this.newPassword !== this.repeatNewPassword) {
        this.passwordEditErrorText = 'You must correctly repeat new password!';
        return;
      }

      const strongPassword =
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

      if (!strongPassword.test(this.newPassword)) {
        this.passwordEditErrorText = 'You must create more secure password!';
        return;
      }

      this.passwordEditErrorText = '';
    },
    saveNewPassword() {
      this.$alert('Password have changed successfully!', 'success');
      // const changePasswordResponse = await AdminController.changePassword(
      //   this.oldPassword,
      //   this.newPassword
      // );
      //
      // if (changePasswordResponse?.status === 200) {
      //   this.$alert("Password have changed successfully!", "success");
      // } else if (changePasswordResponse?.status === 403) {
      //   this.$alert("Old password is not correct!", "warning");
      // } else {
      //   this.$alert("Something went wrong...", "danger");
      // }
    },
  },
});
</script>

<template>
  <div class="container">
    <div id="alertContainer"></div>
    <div class="main">
      <h1>Hello!</h1>
      <h1 class="avatar">🧑‍💻</h1>
      <h1 class="username">{{ username }}</h1>
      <p class="password">{{ passwordInfo }}</p>
      <b-button
        v-b-modal.passwordModal
        class="edit-profile"
        type="button"
        variant="primary"
      >
        Edit password
        <b-icon icon="pencil-square"></b-icon>
      </b-button>

      <!-- Change password Modal -->
      <b-modal
        id="passwordModal"
        centered
        class="modal fade"
        title="Edit password"
        header-bg-variant="primary"
        header-text-variant="light"
        body-bg-variant="dark"
        body-text-variant="light"
        footer-bg-variant="dark"
        footer-text-variant="light"
        @show="resetPasswordModal"
        @cancel="resetPasswordModal"
        @hidden="resetPasswordModal"
        @ok="saveNewPassword"
      >
        <div class="form-floating password-input mb-3">
          <label for="floatingPassword">Old password</label>
          <input
            id="floatingOldPassword"
            v-model="oldPassword"
            type="password"
            class="form-control"
          />
        </div>
        <div class="form-floating password-input mb-3">
          <label for="floatingPassword">New password</label>
          <input
            id="floatingPassword"
            v-model="newPassword"
            type="password"
            class="form-control"
            @change="passwordEditTextsChanged"
          />
        </div>
        <div class="form-floating password-input mb-3">
          <label for="floatingRepeatPassword">Repeat new password</label>
          <input
            id="floatingRepeatPassword"
            v-model="repeatNewPassword"
            type="password"
            class="form-control"
            @change="passwordEditTextsChanged"
          />
        </div>

        <h3 id="errorPasswordLabel" class="modal-title fs-5">
          {{ passwordEditErrorText }}
        </h3>

        <template #modal-footer="{ ok, cancel }">
          <b-button variant="danger" @click="cancel()">Cancel</b-button>
          <b-button
            :disabled="!isPasswordSavingAvailable"
            variant="success"
            @click="ok()"
            >Apply changes</b-button
          >
        </template>
      </b-modal>
    </div>

    <div class="controls">
      <!--      <OptionNavigator-->
      <!--        class="control-item"-->
      <!--        title="Find user"-->
      <!--        page="user-search"-->
      <!--      />-->
      <!--      <OptionNavigator-->
      <!--        class="control-item"-->
      <!--        v-if="isSuperAdmin"-->
      <!--        title="Find admin"-->
      <!--        page="user-search"-->
      <!--      />-->
      <!--      <OptionNavigator-->
      <!--        class="control-item"-->
      <!--        v-if="isSuperAdmin"-->
      <!--        title="FutuructaTrail"-->
      <!--        page="trail"-->
      <!--      />-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin-top: 5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#alertContainer {
  width: 60vw;
  font-size: 20px;
}

.main {
  margin-top: 8vh;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  font-size: 150px;
  text-align: center;
}

.username {
  font-size: 76px;
  text-align: center;
}

.password {
  font-size: 28px;
  text-align: center;
}

.edit-profile {
  font-size: 28px;
  width: 40vw;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  background: #bbb;
  border-radius: 15px;
  width: 50vw;
  margin-top: 50px;

  padding: 20px;

  .control-item {
    margin-bottom: 10px;
    margin-top: 10px;
  }
}

//#editModalLabel {
//  margin-top: 10px;
//  margin-bottom: 5px;
//}

.password-input {
  margin-right: 10px;
  margin-left: 10px;
}

#errorPasswordLabel {
  color: red;
  text-align: center;
  font-size: 22px;
}

//.modal,
//.fade {
//  z-index: 9999999999999 !important;
//}
</style>
