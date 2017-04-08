import Vue from 'vue';
import App from './pages/App';
import router from './routers/view';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
