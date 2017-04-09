import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '../pages/HomePage';
import RealityPage from '../pages/RealityPage';
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
      path: '/reality',
      name: 'reality',
      component: RealityPage,
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigPage,
    },
  ],
});
