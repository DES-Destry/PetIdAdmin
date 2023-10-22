<script lang="ts">
import Vue from 'vue';
import LS from '~/store/constants/LS';

export default Vue.extend({
  name: 'AppHeader',
  data() {
    return {
      username: 'Loading...',
    };
  },
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
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    logout() {
      LS.deleteAuthData();
      this.$router.push({ name: 'login' });
    },
  },
});
</script>

<template>
  <div class="container" data-bs-theme="dark">
    <div class="main">
      <div class="app-name">
        <button type="button" class="btn btn-outline-dark back" @click="back">
          <i class="bi bi-arrow-left"></i>
        </button>
        <img class="ico" src="@/static/icon.png" alt="fut" />
        <h1 class="title">PetID Management</h1>
      </div>
      <div class="user">
        <router-link class="profile-link" to="/profile"
          >🧑‍💻 {{ username }}
        </router-link>
        <button
          type="button"
          class="btn btn-outline-danger logout"
          @click="logout"
        >
          Logout
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  width: 100vw;
  height: 80px;

  border-bottom: 1px solid #696969;

  z-index: 99;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  padding: 10px;
}

.app-name {
  display: flex;
  flex-direction: row;
  align-items: center;

  .back {
    margin-right: 10px;
    font-size: 22px;
    width: 60px;
    height: 60px;
  }

  .title {
    margin-left: 10px;
    margin-bottom: 0 !important;
  }
}

.ico {
  width: 60px;
  height: 60px;
  border-radius: 12px;
}

.user {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.profile-link {
  text-decoration: none;
  font-size: 32px;
  margin-right: 15px;
}

.logout {
  font-size: 22px;
  height: 60px;
}
</style>
