export const DetailActorPage = {
  template: `
    <div class="container-body">
        <div v-if="loading" class="loading-container">
        <div class="loader"></div>
        </div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else>
          <h2>General Information</h2>
          <div class="basic-information-container">
            <img class="revenueItemImg" :src="actor.image" class="d-block w-30" :alt="actor.name">
            <div class="basic-information">
              <div class="basic-information-item">
                <h4>Name:</h4>
                <p>{{ actor?.name }}</p>
              </div>
              <div class="basic-information-item">
                <h4>Summary: </h4>
                <p>{{ actor?.summary }}</p>
              </div>
            </div>
          </div>

          <h2>Cast Movies</h2>
          <div>
            <div class="cast-movies-container" v-for="(movie, index) in castMovies" :class="{ active: index === 0 }" :key="movie.id">
              <div class="cast-movies-item" @click="clickMovie(movie.id)">
                <h2>{{ movie.fullTitle }}</h2>
                <div class="cast-movie-item-content">
                  <img :src="movie.image" alt="Movie Image" />
                  <div class="info-card">
                    <h4>{{ movie.fullTitle }}</h4>
                    <p>Genre: {{ movie.genre }}</p>
                    <p>Directors: {{ movie.directors }}</p>
                    <p>Writers: {{ movie.writers }}</p>
                    <p>Release Date: {{ movie.releaseDate }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  `,
  data() {
    return {
      loading: true,
      error: null,
      actors: [],
      actor: {},
      movies: [],
      castMovies: [],
    };
  },
  created() {
    this.fetchActor();
  },
  methods: {
    chunkMovies(array) {
      let size = 3;
      return Array.from(
        { length: Math.ceil(array?.length / size) },
        (_, index) => array.slice(index * size, index * size + size)
      );
    },
    async fetchMovies() {
      this.loading = true;
      const url = "http://matuan.online:2422/api/Movies";
      try {
        const data = await callApi(url, "GET");
        this.movies = data || [];
      } catch (error) {
        this.error = error;
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchActor() {
      this.loading = true;
      const url = "http://matuan.online:2422/api/Names";
      try {
        const data = await callApi(url, "GET");
        this.actors = data || [];

        const actorId = this.$route.params.actorId;
        const actorData = this.actors.find((x) => x.id === actorId);
        if (!actorData) {
          this.error = "Actor not found.";
          return;
        }

        await this.fetchMovies();

        if (actorData) {
          this.actor = actorData;

          const castMoviesData = actorData.castMovies
            .filter((x) => x.role === "Actor")
            .map((y) => {
              const movieData = this.movies.find((movie) => movie.id === y.id);
              if (!movieData) return null;

              return {
                ...movieData,
                genre: Array.isArray(movieData.genreList)
                  ? movieData.genreList.map((genre) => genre.value).join(", ")
                  : "",
                directors: Array.isArray(movieData.directorList)
                  ? movieData.directorList
                      .map((director) => director.name)
                      .join(", ")
                  : "",
                writers: Array.isArray(movieData.writerList)
                  ? movieData.writerList.map((writer) => writer.name).join(", ")
                  : "",
              };
            })
            .filter(Boolean);

          this.castMovies = castMoviesData;
        }
      } catch (error) {
        this.error = error;
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      } finally {
        this.loading = false;
      }
    },
    clickMovie(movieId) {
      this.$router.push(`/movies/${movieId}`);
    },
  },
};
