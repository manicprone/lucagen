// --------------------------------------------------------
// Manages application settings for the active user session
// --------------------------------------------------------
const settingsData = {
  state: {
    // Maintains the active running web version...
    webVersion: '0.0.0',

    // Application settings for the active web version...
    // (These values will be loaded on startup)
    settings: {
    },
  }, // END - state

  getters: {

    webVersion(state) {
      return state.webVersion;
    },

    // ------------------------------------------------------ Persisted Settings

    appSettings(state) {
      return state.settings;
    },

  }, // END - getters

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  //
  // The "context" parameter is implicitly injected into every
  // "store.dispatch()" invocation made by the components. Use the functions
  // and data exposed by the context object, in order to implement the
  // action logic.
  //
  // The context object will expose:
  //
  // context: {
  //   commit(),        [use this function to invoke a mutation]
  //   dispatch(),      [use this function to invoke an action]
  //   getters,         [use this function to invoke a getter]
  //   rootState,       [access to the full state]
  //   state,           [access to the local state of this module]
  // }
  // ---------------------------------------------------------------------------
  actions: {

    SET_WEB_VERSION(context, version) {
      context.commit('SET_WEB_VERSION', version);
    },

  }, // END - actions

  /* eslint-disable no-param-reassign */
  mutations: {

    SET_WEB_VERSION(state, version) {
      state.webVersion = version;
    },

  }, // END - mutations
  /* eslint-enable no-param-reassign */
};

export default settingsData;
