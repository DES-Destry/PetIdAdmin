<script lang="ts">
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
    };
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
});
</script>

<template>
  <div class="container">
    <div class="main">
      <div id="alertContainer"></div>
      <h1 class="page-title">Tags</h1>

      <div class="search">
        <label class="sr-only" for="inline-form-input-search-text"
          >Search</label
        >
        <b-form-input
          id="inline-form-input-search-text"
          v-model="searchString"
          type="number"
          class="mb-2 mr-sm-2 mb-sm-0 bg-dark text-light search-text"
          placeholder="ID"
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
          :is-already-in-use="tag.isAlreadyInUse"
          :created-at="tag.createdAt.toString()"
        />
      </div>
      <footer class="create">
        <b-button class="create-button" variant="success">
          Create new
          <b-icon class="create-icon" icon="plus-circle"></b-icon>
        </b-button>
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
