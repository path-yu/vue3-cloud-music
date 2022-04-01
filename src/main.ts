import 'normalize.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/transition.css';
import './assets/css/common.css';
import i18n from './i18n';
import './index.css';
import router from './router';
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount('#app');


