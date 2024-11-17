export const HomePage = {
  data() {
    return {
      loading: true,
      error: null,
      darkMode: false,
      movies: [],
      topRevenueMovies: [],
      searchQuery: "",
      topRatingMovies: [],
      participants: [],
      reviews: [],
      mostPopularMovies: [],
    };
  },
  created() {
    this.fetchMostPopularMovies();
    this.fetchTop50Movies();
    this.fetchMovies();
  },
  template: ` <div class="container-body">
                <div>
                <div v-if="loading">Loading...</div>
                <div v-else-if="error">{{ error }}</div>
                <div id="movieCarousel" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item" v-for="(movie, index) in topRevenueMovies" :class="{ active: index === 0 }"
                            :key="movie.id">
                            <div class="d-flex justify-content-center">
                                <img class="revenueItemImg" :src="movie.image" class="d-block w-30" :alt="movie.fullTitle">
                                <div class="movie-info movie-overlay mt-3" >
                                    <h4>{{ movie?.fullTitle }}</h4>
                                    <p>{{ movie?.genre}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#movieCarousel" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#movieCarousel" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
                <h3 class="title-caursol">Most Popular</h3>
                <div id="movieMostPopularCarousel" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner top-rating-caursol-inner">
                        <div class="carousel-item top-rating-caursol-item" v-for="(chunk, chunkIndex) in chunkMovies(mostPopularMovies)"
                            :class="{ active: chunkIndex === 0 }" :key="chunkIndex">
                            <div class="d-flex justify-content-around">
                                <div v-for="(movie, index) in chunk" :key="movie.id" class="top-rating-movie-item">
                                    <img :src="movie.image" class="d-block w-30" :alt="movie.fullTitle">
                                    <div class="mt-3 movie-info-popup">
                                        <h4>{{ movie?.fullTitle }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#movieMostPopularCarousel" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#movieMostPopularCarousel" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
                <h3 class="title-caursol">Top Rating</h3>
                <div id="movieRatingCarousel" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner top-rating-caursol-inner">
                        <div class="carousel-item top-rating-caursol-item" v-for="(chunk, chunkIndex) in chunkMovies(topRatingMovies)"
                            :class="{ active: chunkIndex === 0 }" :key="chunkIndex">
                            <div class="d-flex justify-content-around">
                                <div v-for="(movie, index) in chunk" :key="movie.id" class="top-rating-movie-item">
                                    <img :src="movie.image" class="d-block w-30" :alt="movie.fullTitle">
                                    <div class=" mt-3 movie-info-popup" >
                                        <h4>{{ movie?.fullTitle }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#movieRatingCarousel" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#movieRatingCarousel" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>`,
  methods: {
    chunkMovies(array) {
      let size = 3;
      return Array.from(
        { length: Math.ceil(array.length / size) },
        (_, index) => array.slice(index * size, index * size + size)
      );
    },
    async fetchTop50Movies() {
      this.loading = true;
      const url = "http://matuan.online:2422/api/Top50Movies";
      try {
        const data = await callApi(url, "GET");
        this.topRatingMovies = data.slice(0, 30);
      } catch (error) {
        this.error = error;
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchMostPopularMovies() {
      this.loading = true;
      const url = "http://matuan.online:2422/api/MostPopularMovies";
      try {
        const data = await callApi(url, "GET");
        this.mostPopularMovies = data.slice(0, 30);
      } catch (error) {
        this.error = error;
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchMovies() {
      this.loading = true;
      const url = "http://matuan.online:2422/api/Movies";
      try {
        const data = await callApi(url, "GET");
        this.movies = data;
        this.topRevenueMovies = this.movies
          .sort((a, b) => a.imDbRatingCount - b.imDbRatingCount)
          .slice(0, 5);
      } catch (error) {
        this.error = error;
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
