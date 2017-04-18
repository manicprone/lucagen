import Vue from 'vue';
import Vuex from 'vuex';
import settingsData from './modules/app/store';
import dotWorldData from './modules/dotWorld/store';
import taxonData from './modules/taxa/store';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    // Manages the settings for the running application
    app: settingsData,

    // Manages dot world data for the active session
    dotWorld: dotWorldData,

    // Manages lucafeed data for the active session
    taxa: taxonData,
  },
});

export default store;
