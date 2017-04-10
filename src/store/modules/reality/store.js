// -----------------------------------------------
// Exposes the API actions and data of a Dot world
// -----------------------------------------------
const realityData = {
  state: {

    // The active dot world...
    world: {
      info: {
        dots: [],
      },
      dotRegistry: {
        lonely: {
          top: 0,
          left: 0,
        },
      },
    },

  }, // END - state

  getters: {

    dotWorld(state) {
      return state.world;
    },

    dotWorldInfo(state) {
      return state.world.info;
    },

    dotWorldRegistry(state) {
      return state.world.dotRegistry;
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

    // LOAD_TAXA_ROOT(context) {
    //   const { commit } = context;
    //
    //   return taxaActions.getRoot()
    //     .then((payload) => {
    //       // const collection = toModel(payload);
    //       const collection = payload.items;
    //       commit('SET_TAXA_ROOT', collection);
    //
    //       return collection;
    //     })
    //     .catch((error) => {
    //       console.error('[STORE] error =>', error);
    //       return [];
    //     });
    // },

  },

  /* eslint-disable no-param-reassign */
  mutations: {

    // SET_TAXA_ROOT(state, collection) {
    //   state.root = collection;
    // },

  }, // END - mutations
  /* eslint-enable no-param-reassign */
};

export default realityData;
