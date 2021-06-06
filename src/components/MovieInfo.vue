<template>
    <div class="card text-white bg-dark mb-3">
        <div class="row no-gutters">
            <div class="col-md-4">
                <a :href="movieLink" target="_blank"
                    ><img
                        style="max-width: 18rem;"
                        class="card-img"
                        :src="imageUrl"
                        :alt="movieTitle"
                /></a>
            </div>
            <div class="col-md-8">
                <div class="card-body white-text">
                    <h5 class="card-title">{{ movieTitle }}</h5>
                    <p class="card-text">{{ movieCast }}</p>
                    <p class="card-text">
                        <small class="text-muted">{{ movieYear }}</small>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        imageUrl: {
            type: String,
            default: '',
        },
        movieTitle: {
            type: String,
            default: '',
        },
        movieCast: {
            type: String,
            default: '',
        },
        movieLink: {
            type: String,
            default: '',
        },
        movieYear: {
            type: [Number, String],
            default: '',
        },
    },
};
</script>
