import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import App from './pages/App';
import router from './routers/view';
import store from './store';

Vue.config.productionTip = false;

// Sync the router with the vuex store...
// (this registers `store.state.route`)
sync(store, router);

/* eslint-disable no-new */
new Vue({
  el: '#app',

  // Inject router for all components to utilize...
  // Reference as: this.$router
  router,

  // Inject store for all components to utilize...
  // Reference as: this.$store
  store,

  // Load app components (Pages and Components)...
  template: '<App/>',
  components: { App },
});
