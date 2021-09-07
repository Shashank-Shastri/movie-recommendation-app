<template>
    <div class="starter-page">
        <div class="section text-center">
            <SlideShow :items="slides" />

            <Multiselect
                :delay="0"
                :filterResults="false"
                :options="async query => await debouncedSearchMovies(query)"
                :resolve-on-load="false"
                no-options-text="type to search IMDb movies.."
                placeholder="Type a movie you like"
                searchable
                v-model="selectedMovie"
            >
                <template #option="{ option: movie }">
                    <movie-info
                        :image-url="movie.imageUrl"
                        :movie-cast="movie.cast"
                        :movie-title="movie.title"
                        :movie-year="movie.year"
                    />
                </template>
                <template #singlelabel="{ value: movie }">
                    <div class="selected d-center white-text">
                        <img :src="movie.imageUrl" />
                        {{ movie.title }}
                        {{ movie.year ? `(${movie.year})` : '' }}
                    </div>
                </template>
            </Multiselect>
        </div>
        <div class="section">
            <movie-info
                v-for="movie in recommendedMovies"
                :key="movie.imdb_title_id"
                :image-url="movie.imageUrl"
                :movie-cast="movie.cast"
                :movie-link="movie.link"
                :movie-title="movie.title"
                :movie-year="movie.year"
            />
            <loading
                v-if="loadingRecommendation"
                :active="true"
                :opacity="0.9"
                background-color="#18191E"
                color="#D5D5D8"
                loader="dots"
            />
            <span
                v-if="
                    !loadingRecommendation &&
                        !recommendedMovies.length &&
                        selectedMovie
                "
            >
                We have no recommendations for this movie.
            </span>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { asyncDebounce, shuffle } from '../utils';
import Multiselect from '@vueform/multiselect';
import MovieInfo from './MovieInfo.vue';
import fetchJsonp from 'fetch-jsonp';
import SlideShow from './SlideShow.vue';
import { movieSlides } from '../constants';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    name: 'Starter',
    components: {
        Loading,
        Multiselect,
        MovieInfo,
        SlideShow,
    },
    data() {
        return {
            movies: [],
            recommendedMovies: [],
            selectedMovie: '',
            slides: movieSlides,
            loadingRecommendation: false,
        };
    },
    beforeMount() {
        this.slides = shuffle(this.slides);
    },
    watch: {
        selectedMovie() {
            this.recommendedMovies = [];
            this.movieSelected();
        },
    },
    computed: {
        debouncedSearchMovies() {
            return asyncDebounce(this.searchMovies, 1000);
        },
    },
    methods: {
        /**
         * @param {String} movieTitle - The movie title to search by
         * @returns {Promise} Array of movie objects
         */
        async searchMovies(movieTitle) {
            let results = [];
            if (!movieTitle) return results;
            try {
                const search = movieTitle
                    .replaceAll(' ', '_')
                    .toLowerCase()
                    .split(':')[0];
                const response = await fetchJsonp(
                    `https://sg.media-imdb.com/suggests/${search[0]}/${search}.json`,
                    { jsonpCallbackFunction: `imdb$${search}` }
                );
                const data = await response.json();
                results = data.d.map(movie => ({
                    cast: movie?.s ?? '',
                    imageUrl: movie?.i?.[0] ?? '',
                    link: `https://www.imdb.com/title/${movie.id}`,
                    title: movie.l,
                    year: movie?.y ?? '',
                    id: movie.id,
                }));
            } catch (e) {
                console.error(e.toString());
            }
            return results;
        },
        async movieSelected() {
            try {
                const imdb_id = this.selectedMovie?.id;
                if (imdb_id) {
                    this.loadingRecommendation = true;
                    this.recommendedMovies = [];
                    let {
                        data: { result: movies },
                    } = await axios.get(
                        `${process.env.VUE_APP_BACKEND_URL}/recommend_movies?imdb_id=${imdb_id}`
                    );
                    movies = await Promise.all(
                        movies.map(async movie => {
                            const results = await this.searchMovies(
                                movie.title
                            );
                            const imdbData =
                                results.find(
                                    imdbMovie =>
                                        imdbMovie.id === movie.imdb_title_id
                                ) || {};
                            return {
                                ...imdbData,
                                ...movie,
                                link: `https://www.imdb.com/title/${movie.imdb_title_id}`,
                            };
                        })
                    );
                    this.loadingRecommendation = false;
                    this.recommendedMovies = movies;
                }
            } catch (e) {
                this.loadingRecommendation = false;
                console.error(e.toString());
            }
        },
    },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
