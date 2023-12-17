<script lang="ts">
import { publicEncrypt, randomBytes } from 'crypto';
import Vue from 'vue';
import LS from '~/store/constants/LS';
import { TagReviewDto } from '~/api/dto/tag.dto';
import TagCard from '~/components/tag.vue';

export default Vue.extend({
  components: { TagCard },
  data() {
    return {
      tags: [] as TagReviewDto[],
      searchString: '',

      virginFilterOptions: [
        { text: 'Show all', value: { showVirgin: true, showNotVirgin: true } },
        {
          text: 'Show only virgin',
          value: { showVirgin: true, showNotVirgin: false },
        },
        {
          text: 'Show only not virgin',
          value: { showVirgin: false, showNotVirgin: true },
        },
      ],
      virginFilter: {
        showVirgin: true,
        showNotVirgin: true,
      },

      idFrom: '',
      idTo: '',
    };
  },
  computed: {
    isTagsCanCreated() {
      return (
        typeof +this.idFrom === 'number' &&
        typeof +this.idTo === 'number' &&
        this.idFrom !== '' &&
        this.idTo !== '' &&
        this.idFrom <= this.idTo
      );
    },
  },
  async mounted() {
    const tagsResponse = await this.$adminController.getAllTags();

    if (!tagsResponse) {
      this.$alert('Something went wrong... Real shit is happening', 'danger');
      return;
    }

    if (tagsResponse.status === 401) {
      LS.deleteAuthData();
      await this.$router.push('/login?expired=true');

      return;
    }

    if (tagsResponse.status !== 200) {
      this.$alert(
        `Something went wrong... Real shit is happening (Status ${tagsResponse.status})`,
        'danger',
      );
      return;
    }

    this.tags = tagsResponse.data.tags;
  },
  methods: {
    resetCreateTagsModal() {
      this.idFrom = '';
      this.idTo = '';
    },
    createTags() {
      const key = require('@/static/cert/public.pem').default;

      const count = this.idTo - this.idFrom + 1;
      const codes: string[] = [];

      for (let i = 0; i < count; i++) {
        const code = randomBytes(16);

        // Encode them with a public key
        const encoded = publicEncrypt(key, code).toString('base64');
        codes.push(encoded);
      }

      // Send POST request
    },
  },
});
</script>

<template>
  <div class="container">
    <div class="main">
      <div id="alertContainer"></div>
      <h1 class="page-title">Tags</h1>

      <div class="search">
        <label class="sr-only" for="inline-form-input-search-text">
          Search
        </label>
        <b-form-input
          id="inline-form-input-search-text"
          v-model="searchString"
          class="mb-2 mr-sm-2 mb-sm-0 bg-dark text-light search-text"
          placeholder="ID"
          type="number"
        ></b-form-input>

        <b-form-select
          id="inline-form-input-virgin-filter"
          :options="virginFilterOptions"
          :value="virginFilter"
          class="mb-2 mr-sm-2 mb-sm-0 bg-dark text-light virgin-filter"
          placeholder="Virgin filter"
        ></b-form-select>

        <b-button variant="primary">
          <b-icon icon="search"></b-icon>
        </b-button>
      </div>
      <div class="tag-list">
        <tag-card
          v-for="tag of tags"
          :id="tag.id"
          :key="tag.id"
          :created-at="tag.createdAt.toString()"
          :is-already-in-use="tag.isAlreadyInUse"
        />
      </div>
      <footer class="create">
        <b-button
          v-b-modal.createTagsModal
          class="create-button"
          variant="success"
        >
          Create new
          <b-icon class="create-icon" icon="plus-circle"></b-icon>
        </b-button>
      </footer>

      <!-- Create tags Modal -->
      <b-modal
        id="createTagsModal"
        body-bg-variant="dark"
        body-text-variant="light"
        centered
        class="modal fade"
        footer-bg-variant="dark"
        footer-text-variant="light"
        header-bg-variant="primary"
        header-text-variant="light"
        title="Create new tags"
        @cancel="resetCreateTagsModal"
      >
        <div class="form-floating number-input mb-3">
          <label for="floatingIdPassword">ID From</label>
          <input
            id="floatingIdPassword"
            v-model="idFrom"
            class="form-control bg-dark text-light"
            type="number"
          />
        </div>
        <div class="form-floating number-input mb-3">
          <label for="floatingIdTo">ID To</label>
          <input
            id="floatingIdTo"
            v-model="idTo"
            class="form-control bg-dark text-light"
            type="number"
          />
        </div>

        <template #modal-footer="{ cancel }">
          <b-button variant="danger" @click="cancel()">Cancel</b-button>
          <b-button
            :disabled="!isTagsCanCreated"
            variant="success"
            @click="createTags"
            >Create
          </b-button>
        </template>
      </b-modal>
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

.main {
  margin-top: 8vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}

.page-title {
  font-weight: bolder;
  font-size: 72px;
}

.search {
  margin-top: 30px;
  display: flex;
  width: 50vw;
}

.tag-list {
  // footer height (140px) + 50px
  margin-bottom: 190px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 50vw;

  margin-top: 50px;

  * {
    margin: 15px;
  }
}

footer {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;

  width: 100vw;
  height: 140px;

  background: #151515;
  border-top: 1px solid #696969;

  z-index: 99;

  position: fixed;
  margin-top: calc(100vh - 260px);
}

.create-button {
  font-size: 32px;
  width: 40vw;
}

.create-icon {
  width: 25px;
  margin-left: 5px;
}
</style>
