import Vue from 'vue';
import Vuex from 'vuex';
import settingsData from './modules/app/store';
import dotWorldData from './modules/dotWorld/store';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    // Manages the settings for the running application
    app: settingsData,

    // Manages dot world data for the active session
    dotWorld: dotWorldData,
  },
});

export default store;
