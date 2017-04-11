import objectUtils from '../../../helpers/object-utils';
import World from '../../../models/World';
import Dot from '../../../models/Dot';

// -----------------------------------------------
// Exposes the API actions and data of a Dot world
// -----------------------------------------------
const realityData = {
  state: {

    // The active dot world...
    world: null,

  }, // END - state

  getters: {

    dotWorld(state) {
      return state.world;
    },

    dotWorldInfo(state) {
      if (state.world && state.world.info) {
        return state.world.info;
      }
      return {};
    },

    dotWorldRegistry(state) {
      if (state.world && state.world.dotRegistry) {
        const registry = {};

        // Hydrate dot data into Dot models...
        const dots = Object.keys(state.world.dotRegistry);
        dots.forEach((dotID) => {
          const dotData = state.world.dotRegistry[dotID];
          const dot = new Dot(dotData);
          registry[dotID] = dot;

          console.log('[STORE] hydrated Dot =>', dot);
        });

        return registry;
      }
      return {};
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

    CREATE_WORLD(context, options) {
      const { commit } = context;

      // Handle options...
      const name = objectUtils.get(options, 'name', null);
      const width = objectUtils.get(options, 'width', 400);
      const height = objectUtils.get(options, 'height', 200);
      const dots = objectUtils.get(options, 'dots', []);

      // Configure world...
      const world = new World({
        width,
        height,
      });
      if (name) world.name = name;

      // Populate with pioneers...
      dots.forEach((dotData) => {
        dotData.new = true; // eslint-disable-line no-param-reassign
        const dot = new Dot(dotData);
        world.addDot(dot);
      });

      commit('SET_WORLD', world);
    },

    NOTIFY_DOT_UPDATE(context, update) {
      const { commit } = context;
      commit('SET_DOT_UPDATE', update);
    },

  },

  /* eslint-disable no-param-reassign */
  mutations: {

    SET_WORLD(state, world) {
      console.log('[STORE] WORLD ===>', world);

      state.world = world;
    },

    SET_DOT_UPDATE(state, update) {
      console.log('[STORE] DOT UPDATE ===>', update);

      const dotID = update.id;
      const dotData = update.dotData;
      state.world.dotRegistry[dotID] = dotData;
    },

  }, // END - mutations
  /* eslint-enable no-param-reassign */
};

export default realityData;
