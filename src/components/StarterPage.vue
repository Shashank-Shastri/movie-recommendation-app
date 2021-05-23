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
import { debounce, get, shuffle } from 'lodash';
import MovieInfo from './MovieInfo.vue';
import fetchJsonp from 'fetch-jsonp';
import SlideShow from './SlideShow.vue';

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
            slides: [{
                'id': 'tt0111161',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0111161/',
                'title': 'The Shawshank Redemption'
            }, {
                'id': 'tt0068646',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0068646/',
                'title': 'The Godfather'
            }, {
                'id': 'tt0071562',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0071562/',
                'title': 'The Godfather: Part II'
            }, {
                'id': 'tt0468569',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0468569/',
                'title': 'The Dark Knight'
            }, {
                'id': 'tt0050083',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0050083/',
                'title': '12 Angry Men'
            }, {
                'id': 'tt0108052',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0108052/',
                'title': 'Schindler\'s List'
            }, {
                'id': 'tt0167260',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0167260/',
                'title': 'The Lord of the Rings: The Return of the King'
            }, {
                'id': 'tt0110912',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0110912/',
                'title': 'Pulp Fiction'
            }, {
                'id': 'tt0060196',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BOTQ5NDI3MTI4MF5BMl5BanBnXkFtZTgwNDQ4ODE5MDE@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0060196/',
                'title': 'The Good, the Bad and the Ugly'
            }, {
                'id': 'tt0120737',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0120737/',
                'title': 'The Lord of the Rings: The Fellowship of the Ring'
            }, {
                'id': 'tt0137523',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0137523/',
                'title': 'Fight Club'
            }, {
                'id': 'tt0109830',
                'imageUrl': 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX674_.jpg',
                'link': 'https://www.imdb.com/title/tt0109830/',
                'title': 'Forrest Gump'
            }]
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
@import '../assets/v-select-theme.scss';

.vs__dropdown-toggle {
    border-radius: 5px !important;
    border-color: whitesmoke !important;
}
</style>
