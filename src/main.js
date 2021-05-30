import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import vSelect from '../node_modules/vue-select/src/index';

const app = createApp(App).use(router);

app.component('VSelect', vSelect);

app.mount('#app');
