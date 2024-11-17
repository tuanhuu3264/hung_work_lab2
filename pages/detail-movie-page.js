export const DetailPage = {
  template: `
              <div class="container-body">
                <div>
                    <div v-if="loading">Loading...</div>
                    <div v-else-if="error">{{ error }}</div>
                    <div v-else>
                       <h2>General Information</h2>
                       <div class="basic-information-container">
                        <img class="revenueItemImg" :src="movie.image" class="d-block w-30" :alt="movie.fullTitle">
                        <div class="basic-information">
                            <div class="basic-information-item">
                                <h4>Full Title:</h4>
                                <p>{{ movie?.fullTitle}}</p>
                            </div>
                            <div class="basic-information-item">
                                <h4>Genre: </h4>
                                <p>{{ movie?.genre}}</p>
                            </div>
                            <div class="basic-information-item">
                                <h4>Directors: </h4>
                                <p>{{ movie?.directors}}</p>
                            </div>
                            <div class="basic-information-item">
                                <h4>Writers: </h4>
                                <p>{{ movie?.writers}}</p>
                            </div>
                            <div class="basic-information-item">
                                <h4>Release Date: </h4>
                                <p>{{ movie?.releaseDate}}</p>
                            </div>
                            <div class="basic-information-item">
                                <h4>Run Time: </h4>
                                <p>{{ movie?.runtimeStr}}</p>
                            </div>
                            <div class="basic-information-item">
                                <h4>Plot: </h4>
                                <p>{{ movie?.plot}}</p>
                            </div>
                            <div class="basic-information-item">
                                <h4>Companies: </h4>
                                <p>{{ movie?.companies}}</p>
                            </div>
                            <div class="basic-information-item">
                                <h4>Languages: </h4>
                                <p>{{ movie?.languages}}</p>
                            </div>
                        </div>
                       </div>

                       <h2>Actors</h2>

                    <div id="actorCarousel" class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner top-rating-caursol-inner">
                            <div class="carousel-item top-rating-caursol-item" v-for="(chunk, chunkIndex) in chunkActors(actors)"
                                :class="{ active: chunkIndex === 0 }" :key="chunkIndex">
                                <div class="d-flex justify-content-around">
                                    <div v-for="(actor, index) in chunk" :key="actor.id" class="top-rating-movie-item" @click="clickActor(actor.id)">
                                        <img :src="actor.image" class="d-block w-30" :alt="actor.name">
                                        <div class=" mt-3">
                                            <h4>{{ actor?.name }}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a class="carousel-control-prev" href="#actorCarousel" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#actorCarousel" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div>

                     <h2>Reviews</h2>
                      <div>
                        <div class="review-container" v-for="(review, index) in reviews" :class="{ active: index === 0 }" :key="review.id">
                            <div class="review-item">
                                <p><span>{{ review.username }}</span> - {{ review.date }}</p>
                                <h2>{{ review.title }}</h2>
                                <div class="star-rating">
                                    <span class="star fa fa-star" :class="{'checked': review.rate >= 2}"></span>
                                    <span class="star fa fa-star" :class="{'checked': review.rate >= 4}"></span>
                                    <span class="star fa fa-star" :class="{'checked': review.rate >= 6}"></span>
                                    <span class="star fa fa-star" :class="{'checked': review.rate >= 8}"></span>
                                    <span class="star fa fa-star" :class="{'checked': review.rate >= 10}"></span>
                                </div>
                                <p>{{ review.content }}</p>
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
      movie: {},
      actors: [],
      reviews: [],
      movies: [],
    };
  },
  created() {
    this.fetchMovies();
    this.fetchReviews();
  },
  methods: {
    chunkActors(array) {
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
        this.movies = data;
        let movieId = this.$route.params.movieId;

        const movieData = this.movies.find((movie) => movie.id === movieId);

        if (movieData) {
          this.movie = {
            ...movieData,
            genre: Array.isArray(movieData.genreList)
              ? movieData.genreList.map((genre) => genre.value).join(", ")
              : "",
            actors: movieData.actorList || [],
            directors: Array.isArray(movieData.directorList)
              ? movieData.directorList
                  .map((director) => director.name)
                  .join(", ")
              : "",
            writers: Array.isArray(movieData.writerList)
              ? movieData.writerList.map((writer) => writer.name).join(", ")
              : "",
          };
          this.actors = this.movie.actors;
        }
      } catch (error) {
        this.error = error;
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchReviews() {
      this.loading = true;
      const url = "http://matuan.online:2422/api/Reviews";
      try {
        const data = await callApi(url, "GET");
        this.reviews = data;
        let movieId = this.$route.params.movieId;
        const reviewsData = this.reviews.find(
          (review) => review.movieId === movieId
        );

        if (reviewsData) {
          this.reviews = reviewsData.items;
        }
      } catch (error) {
        this.error = error;
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      } finally {
        this.loading = false;
      }
    },
    clickActor(actorId) {
      this.$router.push(`/actors/${actorId}`);
    },
  },
};
