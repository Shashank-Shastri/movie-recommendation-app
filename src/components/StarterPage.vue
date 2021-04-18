<template>
    <div class="starter-page">
        <div class="section text-center">
            <h3>Search a movie you like</h3>
            <v-select @search="onSearch" :filterable="false" :options="movies" v-model="selectedMovie" label="l">
                <template v-slot:no-options>
                    type to search IMDb movies..
                </template>
                <!--<template slot="option" slot-scope="movie">
                    <div class="d-center">
                        <img :src='movie.i.imageUrl'/> 
                        {{ movie.l }}
                        </div>
                </template>-->
                <template v-slot:option="movie">
                    <movie-info
                        :image-url="movie.imageUrl"
                        :movie-cast="movie.cast"
                        :movie-title="movie.title"
                        :movie-year="movie.year"
                    />
                    <!--<card>
                            <img slot="image" style="width: 10rem;" class="card-img-top" :src="movie.i.imageUrl" :alt="movie.l">
                            <p class="card-text">{{ movie.l }}</p>
                    </card>-->
                </template>
                <template v-slot:selected-option="movie">
                    <div class="selected d-center">
                        <img :src='movie.imageUrl'/> 
                        {{ movie.title }}
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
import { debounce, get } from 'lodash';
import MovieInfo from './MovieInfo.vue';
import fetchJsonp from 'fetch-jsonp';

const _ = { debounce, get };

export default {
    name: 'starter',
    components: {
        MovieInfo
    },
    data() {
        return {
            selectedMovie: '',
            movies: [],
            recommendedMovies: []
        };
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
.starter-page {
    min-height: calc(100vh - 95px);
}

img {
    height: auto;
    max-width: 2.5rem;
    margin-right: 1rem;
}

.d-center {
    display: flex;
    align-items: center;
}

.selected img {
    width: auto;
    max-height: 50px;
    margin-right: 0.5rem;
}

.v-select .dropdown li {
    border-bottom: 1px solid rgba(112, 128, 144, 0.1);
}

.v-select .dropdown li:last-child {
    border-bottom: none;
}

.v-select .dropdown li a {
    padding: 10px 20px;
    width: 100%;
    font-size: 1.25em;
    color: #3c3c3c;
}

.v-select .dropdown-menu .active > a {
    color: #fff;
}
</style>
