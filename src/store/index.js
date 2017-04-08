import Vue from 'vue';
import Vuex from 'vuex';
import settingsData from './modules/app/store';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    // Manages the settings for the running application
    app: settingsData,
  },
});

export default store;
