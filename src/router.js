import { createWebHistory, createRouter } from 'vue-router';
import Home from './page/home.vue';
import Favorite from './page/favorite.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/favorite',
    name: 'Favorite',
    component: Favorite,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
