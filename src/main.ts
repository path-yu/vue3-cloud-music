import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';
import 'normalize.css';
import i18n from './i18n';
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount('#app');


