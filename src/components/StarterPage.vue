<template>
    <div class="starter-page">
        <div class="section text-center">
            <SlideShow :items="slides"/>
            <v-select
                @search="onSearch"
                :filterable="false"
                :options="movies"
                v-model="selectedMovie"
                label="l"
                placeholder="Type a movie you like"
            >
                <template v-slot:no-options>
                    type to search IMDb movies..
                </template>
                <template v-slot:option="movie">
                    <movie-info
                        :image-url="movie.imageUrl"
                        :movie-cast="movie.cast"
                        :movie-title="movie.title"
                        :movie-year="movie.year"
                    />
                </template>
                <template v-slot:selected-option="movie">
                    <div class="selected d-center white-text">
                        <img :src='movie.imageUrl'/> 
                        {{ movie.title }} ({{ movie.year }})
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
                :movie-link="`https://www.imdb.com/title/${movie.imdb_title_id}`"
                :movie-title="movie.title"
                :movie-year="movie.year"
            />
            <span v-if="!recommendedMovies.length && selectedMovie">We have no recommendations for this movie.</span>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { debounce, get, shuffle } from 'lodash';
import MovieInfo from './MovieInfo.vue';
import fetchJsonp from 'fetch-jsonp';
import SlideShow from './SlideShow.vue';
import { movieSlides } from '../constants'

const _ = { debounce, get, shuffle };

export default {
    name: 'starter',
    components: {
        MovieInfo,
        SlideShow
    },
    data() {
        return {
            movies: [],
            recommendedMovies: [],
            selectedMovie: '',
            slides: movieSlides
        };
    },
    beforeMount() {
        this.slides = _.shuffle(this.slides);
    },
    watch: {
        selectedMovie() {
            this.movieSelected();
        }
    },
    methods: {
        onSearch(search, loading) {
            if(search.length) {
                loading(true);
                let searchText = search.replaceAll(' ', '_').toLowerCase();
                this.search(loading, searchText, this);
            }
        },
        search: _.debounce(async (loading, search, vm) => {
            fetchJsonp(`https://sg.media-imdb.com/suggests/${search[0]}/${search}.json`, { jsonpCallbackFunction: `imdb$${search}` })
            .then(response => response.json())
            .then(data => {
                vm.movies = data.d.map(movie => {
                    return {
                        cast: _.get(movie, 's', ''),
                        imageUrl: _.get(movie, 'i[0]', ''),
                        title: movie.l,
                        year: _.get(movie, 'y', ''),
                        id: movie.id
                    };
                });
            });
            loading(false);
        }, 1000),
        async movieSelected() {
            try {
                const imdb_id = this.selectedMovie.id;
                if(imdb_id) {
                    this.recommendedMovies = [];
                    let { data: movies, status } = await axios.get(`https://recommend-movie-api.herokuapp.com/recommend_movies?imdb_id=${imdb_id}`);
                    if(status === 200) {
                        movies = await Promise.all(movies.result.map(async (movie) => {
                            const title = movie.title.toLowerCase();
                            const callbackName = title.replaceAll(' ', '_');
                            return fetchJsonp(`https://sg.media-imdb.com/suggests/${title[0]}/${title}.json`, { jsonpCallbackFunction: `imdb$${callbackName}` })
                            .then(response => response.json())
                            .then(imdbData => {
                                imdbData = {
                                    cast: _.get(imdbData, 'd[0].s', ''),
                                    imageUrl: _.get(imdbData, 'd[0].i[0]', ''),
                                    year: _.get(imdbData, 'd[0].y', '')
                                }
                                return { ...movie, ...imdbData };
                            });
                        }));
                        this.recommendedMovies = movies;
                    }
                }
            } catch(e) {
                console.error(e);
            }
        }
    }
};
</script>

<style>
@import '../assets/v-select-theme.scss';

.vs__dropdown-toggle {
    border-radius: 5px !important;
    border-color: whitesmoke !important;
}
</style>
