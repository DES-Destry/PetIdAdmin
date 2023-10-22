<script lang="ts">
import Vue from 'vue';
import LS from '~/store/constants/LS';
export default Vue.extend({
  // components: { OptionNavigator },
  data() {
    return {
      username: 'Loading...',
      isNotCapable: true,
      passwordChangedAt: new Date(0),
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
      if (this.passwordChangedAt.getTime() === 0) {
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

      return `Password last changed at: ${this.passwordChangedAt.toLocaleString(
        'en-US',
      )}`;
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
    this.passwordChangedAt = new Date(
      authResponse.data.passwordLastChangedAt ?? 0,
    );
    this.createdAt = new Date(authResponse.data.createdAt);
  },
  methods: {
    passwordEditTextsChanged() {
      if (this.newPassword !== this.repeatNewPassword) {
        this.passwordEditErrorText = 'You must correctly repeat new password!';
        this.isPasswordSaveButtonDisabled = true;
        return;
      }

      const strongPassword =
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

      if (!strongPassword.test(this.newPassword)) {
        this.passwordEditErrorText = 'You must create more secure password!';
        this.isPasswordSaveButtonDisabled = true;
        return;
      }

      this.isPasswordSaveButtonDisabled =
        this.oldPassword === '' || this.newPassword === '';
      this.passwordEditErrorText = '';
    },
    async saveNewPassword() {
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
    <div id="liveResultAlert"></div>
    <div class="main">
      <h1 class="avatar">🧑‍💻</h1>
      <h1 class="username">{{ username }}</h1>
      <p class="password">{{ passwordInfo }}</p>
      <button
        type="button"
        class="btn btn-primary edit-profile mb-xl-4"
        data-bs-toggle="modal"
        data-bs-target="#editModal"
      >
        Edit profile
        <i class="bi bi-pencil-square"></i>
      </button>

      <!-- Change password Modal -->
      <div
        id="editModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 id="editModalLabel" class="modal-title fs-5">
                Edit your profile
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <h1 id="editModalLabel" class="modal-title fs-5">
              Edit your password
            </h1>

            <div class="form-floating password-input mb-3">
              <input
                id="floatingOldPassword"
                v-model="oldPassword"
                type="password"
                class="form-control"
                placeholder="Old password"
              />
              <label for="floatingOldPassword">Old password</label>
            </div>
            <div class="form-floating password-input mb-3">
              <input
                id="floatingPassword"
                v-model="newPassword"
                type="password"
                class="form-control"
                placeholder="New password"
                @change="passwordEditTextsChanged"
              />
              <label for="floatingPassword">New password</label>
            </div>
            <div class="form-floating password-input mb-3">
              <input
                id="floatingRepeatPassword"
                v-model="repeatNewPassword"
                type="password"
                class="form-control"
                placeholder="Repeat new password"
                @change="passwordEditTextsChanged"
              />
              <label for="floatingRepeatPassword">Repeat new password</label>
            </div>

            <h3 id="errorPasswordLabel" class="modal-title fs-5">
              {{ passwordEditErrorText }}
            </h3>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-success"
                data-bs-dismiss="modal"
                :disabled="isPasswordSaveButtonDisabled"
                @click="saveNewPassword"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
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

#liveResultAlert {
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

#editModalLabel {
  margin-top: 10px;
  margin-bottom: 5px;
}

.password-input {
  margin-right: 10px;
  margin-left: 10px;
}

#errorPasswordLabel {
  color: darkred;
}

.modal,
.fade {
  z-index: 9999999999999 !important;
}
</style>
