export const SearchPage = {
  template: `
             <div class="container-body container">
                <div v-if="error">{{ error }}</div>
                <div v-if="loading" class="loading-container">
                <div class="loader"></div>
                </div>
                <div v-else> 
                <div class="row">
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" v-for="(movie, index) in paginatedMovies" :key="movie.id">
                        <div class="item-search-container" @click="clickMovie(movie.id)">
                            <img :src="movie.image" alt="Movie Image" />
                            <div class="info-card">
                                <h4>{{ movie.fullTitle }}</h4>
                                <p>{{movie.genre}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pagination-container">
                    <button class="btn-search" :disabled="page === 1" @click="changePage(page - 1)">Prev</button>
                    <span>{{ page }} / {{ totalPages }}</span>
                    <button class="btn-search" :disabled="page === totalPages" @click="changePage(page + 1)">Next</button>
                </div>
                </div>
            </div>
            `,
  data() {
    return {
      movies: [],
      loading: true,
      error: null,
      paginatedMovies: [],
      searchQuery: "",
      totalPages: 1,
      page: 1,
      per_page: 6,
    };
  },
  created() {
    this.fetchMovies();
    this.page = this.$route.query.page || 1;
    this.per_page = this.$route.query.per_page || 12;
    this.searchQuery = this.$route.query.searchQuery || "";
    this.updatePagination();
  },
  methods: {
    async fetchMovies() {
      this.loading = true;
      const url = "http://matuan.online:2422/api/Movies";
      try {
        const data = await callApi(url, "GET");
        this.movies = data;
        this.updatePagination();
      } catch (error) {
        this.error = error;
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },

    updatePagination() {
      const filteredMovies =
        this.searchQuery !== ""
          ? this.movies.filter(
              (movie) =>
                movie.fullTitle
                  .toLowerCase()
                  .includes(this.searchQuery.toLowerCase()) ||
                (movie.actorList &&
                  movie.actorList.some((actor) =>
                    actor.name
                      .toLowerCase()
                      .includes(this.searchQuery.toLowerCase())
                  ))
            )
          : this.movies;
      const start = (this.page - 1) * this.per_page;
      const end = start + this.per_page;
      this.paginatedMovies = filteredMovies
        .map((v) => ({
          ...v,
          genre: v.genreList.map((g) => g.value).join(", "),
        }))
        .slice(start, end);
      this.totalPages = Math.ceil(filteredMovies.length / this.per_page);
    },
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.updatePagination();
      }
    },
    searchMovies() {
      this.$router.push({
        path: "/search",
        query: { searchQuery: this.searchQuery },
      });
    },
    homeRedirect() {
      this.$router.push({ path: "/" });
    },
    clickMovie(movieId) {
      this.$router.push(`/movies/${movieId}`);
    },
  },
  watch: {
    "$route.query.searchQuery": {
      handler(newSearchQuery) {
        this.searchQuery = newSearchQuery;
        this.page = 1;
        this.updatePagination();
      },
      immediate: true,
    },
  },
};
