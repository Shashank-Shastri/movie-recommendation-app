<template>
    <div>
        <Header />
        <h1 class="white-text">About</h1>
        <div class="white-text">
            This website recommends movie based on the cosine similarity of
            movie cast, keywords, genres and director. To get a recommendation,
            search for a movie you like, based on the similarity, top 5 similar
            movies will be listed.
            <br />
            The source code of the API can be found here:
            <a
                href="https://github.com/Shashank-Shastri/Movie-Recommendation-API"
                >https://github.com/Shashank-Shastri/Movie-Recommendation-API</a
            >.
            <br />
            The source code of the website can be found here:
            <a
                href="https://github.com/Shashank-Shastri/movie-recommendation-app"
                >https://github.com/Shashank-Shastri/movie-recommendation-app</a
            >.
            <br />
            To learn more about me, visit here:
            <a href="https://whoami.shashanks.ga">https://whoami.shashanks.ga</a
            >.
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header';

export default {
    components: {
        Header,
    },
};
</script>
