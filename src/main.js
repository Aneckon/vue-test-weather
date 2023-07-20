import { createApp } from 'vue';

import Vue3Toastify from 'vue3-toastify';

import './style.scss';
import 'vue3-toastify/dist/index.css';

import App from './App.vue';
import router from './router';
import { i18n } from './i18n';

createApp(App)
  .use(router)
  .use(Vue3Toastify, {
    autoClose: 3000,
  })
  .use(i18n)
  .mount('#app');
