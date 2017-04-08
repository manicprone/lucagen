import Vue from 'vue';
import Vuex from 'vuex';
import settingsData from './modules/app/store';
import taxonData from './modules/taxa/store';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    // Manages the settings for the running application
    app: settingsData,

    // Manages lucafeed data for the active user session
    taxa: taxonData,
  },
});

export default store;
