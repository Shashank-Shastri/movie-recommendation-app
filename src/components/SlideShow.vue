<template>
    <Carousel :items-to-show="3" v-if="items.length">
        <Slide
            v-for="{ id, imageUrl, link = '', title = '' } in items"
            :key="id"
        >
            <a :href="link" target="_blank"
                ><img
                    style="max-width: 18rem;"
                    class="card-img"
                    :src="imageUrl"
                    :alt="title"
            /></a>
        </Slide>

        <template #addons>
            <Navigation />
            <Pagination />
        </template>
    </Carousel>
</template>

<script>
import { defineComponent } from 'vue';
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel';

import 'vue3-carousel/dist/carousel.css';

export default defineComponent({
    name: 'SlideShow',
    props: {
        items: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        Carousel,
        Slide,
        Pagination,
        Navigation,
    },
});
</script>

<style>
.carousel__item {
    min-height: 200px;
    width: 100%;
    background-color: var(--carousel-color-primary);
    color: var(--carousel-color-white);
    font-size: 20px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.carousel__slide {
    padding: 10px;
}

.carousel__prev,
.carousel__next {
    box-sizing: content-box;
    border: 5px solid white;
}
</style>
