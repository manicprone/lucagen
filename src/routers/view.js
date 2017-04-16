import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '../pages/HomePage';
import DotWorldPage from '../pages/DotWorldPage';
import ConfigPage from '../pages/ConfigPage';

Vue.use(Router);

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/world',
      name: 'dot-world',
      component: DotWorldPage,
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigPage,
    },
  ],
});
