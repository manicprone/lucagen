// import taxaActions from '../../actions/lucafeed';

// -------------------------------------------------------
// Exposes the API actions for taxon nodes (from lucafeed)
// -------------------------------------------------------
const taxonData = {
  state: {

    // The root tree...
    root: [],

  }, // END - state

  getters: {

    taxaRoot(state) {
      return state.root;
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

    LOAD_TAXA_ROOT(/* context */) {
      // const { commit } = context;

      return [];
      // return taxaActions.getRoot()
      //   .then((payload) => {
      //     // console.log('[STORE] payload =>', payload);
      //
      //     // const collection = toModel(payload);
      //     const collection = payload.items;
      //     commit('SET_TAXA_ROOT', collection);
      //
      //     return collection;
      //   })
      //   .catch((error) => {
      //     console.error('[STORE] error =>', error);
      //     return [];
      //   });
    },

  },

  /* eslint-disable no-param-reassign */
  mutations: {

    SET_TAXA_ROOT(state, collection) {
      state.root = collection;
    },

  }, // END - mutations
  /* eslint-enable no-param-reassign */
};

export default taxonData;
