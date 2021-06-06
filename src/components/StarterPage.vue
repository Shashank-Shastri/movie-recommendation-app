<template>
    <div class="starter-page">
        <div class="section text-center">
            <SlideShow :items="slides" />
            <v-select
                @search="onSearch"
                :filterable="false"
                :options="movies"
                v-model="selectedMovie"
                label="l"
                placeholder="Type a movie you like"
            >
                <template #no-options>
                    type to search IMDb movies..
                </template>
                <template #option="movie">
                    <movie-info
                        :image-url="movie.imageUrl"
                        :movie-cast="movie.cast"
                        :movie-title="movie.title"
                        :movie-year="movie.year"
                    />
                </template>
                <template #selected-option="movie">
                    <div class="selected d-center white-text">
                        <img :src="movie.imageUrl" />
                        {{ movie.title }}
                        {{ movie.year ? `(${movie.year})` : '' }}
                    </div>
                </template>
            </v-select>
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
                :is-full-page="false"
                background-color="#18191E"
                color="#D5D5D8"
                loader="dots"
                :opacity="0.9"
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
import { debounce, get, shuffle } from 'lodash';
import MovieInfo from './MovieInfo.vue';
import fetchJsonp from 'fetch-jsonp';
import SlideShow from './SlideShow.vue';
import { movieSlides } from '../constants';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import '../assets/v-select-theme.scss';

const _ = { debounce, get, shuffle };

export default {
    name: 'Starter',
    components: {
        Loading,
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
        this.slides = _.shuffle(this.slides);
    },
    watch: {
        selectedMovie() {
            this.movieSelected();
            this.recommendedMovies = [];
        },
    },
    methods: {
        onSearch: _.debounce(async function(search, loading) {
            if (search.length) {
                loading(true);
                this.movies = await this.searchMovies(search);
                loading(false);
            }
        }, 1000),
        /**
         * @param {String} movieTitle - The movie title to search by
         * @returns {Promise} Array of movie objects
         */
        async searchMovies(movieTitle) {
            let results = [];
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
                    cast: _.get(movie, 's', ''),
                    imageUrl: _.get(movie, 'i[0]', ''),
                    link: `https://www.imdb.com/title/${movie.id}`,
                    title: movie.l,
                    year: _.get(movie, 'y', ''),
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
