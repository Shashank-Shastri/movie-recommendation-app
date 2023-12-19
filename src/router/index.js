import { createWebHistory, createRouter } from 'vue-router';
import HomePage from '@/views/HomePage/HomePage.vue';
import AboutPage from '@/views/AboutPage/AboutPage.vue';
import NotFound from '@/views/NotFound/NotFound.vue';

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage,
    },
    {
        path: '/about',
        name: 'AboutPage',
        component: AboutPage,
    },
    {
        path: '/:catchAll(.*)',
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
