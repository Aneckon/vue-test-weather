import Vue from 'vue';
import VueRouter from 'vue-router';
import { createWebHistory, createRouter } from 'vue-router';
import Home from './page/Home.vue';
import Favorite from './page/Favorite.vue';

Vue.use(VueRouter);

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
