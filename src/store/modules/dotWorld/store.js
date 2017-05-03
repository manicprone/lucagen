import objectUtils from '../../../utils/object-utils';
import World from '../../../models/World';
import Dot from '../../../models/Dot';

// -----------------------------------------------
// Exposes the API actions and data of a Dot world
// -----------------------------------------------
const dotWorldData = {
  state: {

    // The active dot world...
    world: null,

    // The dots being inspected...
    dotsToInspect: [],

  }, // END - state

  getters: {

    // -------------------------------------------------------------- World Data

    dotWorld(state) {
      // Hydrate world data into World model...
      if (state.world) {
        const world = World.hydrate(state.world);
        return world;
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
          const dot = Dot.hydrate(dotData);
          registry[dotID] = dot;
        });

        return registry;
      }
      return {};
    },

    // --------------------------------------------------------- Dots to Inspect

    dotsToInspect(state) {
      return state.dotsToInspect;
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

    // -------------------------------------------------------- World Management

    CREATE_WORLD(context, worldData) {
      const { commit } = context;

      // Parse out loaded dot data to hydrate...
      const worldConfig = Object.assign({}, worldData);
      if (worldConfig.dots) delete worldConfig.dots;

      // Create world...
      const world = new World(worldConfig);

      // Populate with pioneers...
      const dots = objectUtils.get(worldData, 'dots', []);
      dots.forEach((dotData) => {
        const dot = new Dot(dotData);
        world.addDot(dot);
      });

      commit('SET_WORLD', world);
    },

    ADD_DOT_TO_WORLD(context, dotData) {
      const { commit, getters } = context;
      const world = getters.dotWorld;

      const dot = new Dot(dotData);
      world.addDot(dot);

      commit('SET_WORLD', world);
    },

    RESUME_LIFE(context) {
      const { commit, getters } = context;
      const world = getters.dotWorld;

      world.setFreedom(true);
      world.resumeDots();

      commit('SET_WORLD', world);
    },

    PAUSE_LIFE(context) {
      const { commit, getters } = context;
      const world = getters.dotWorld;

      world.setFreedom(false);
      world.pauseDots();

      commit('SET_WORLD', world);
    },

    // ---------------------------------------------------------- Dot Management

    NOTIFY_DOT_UPDATE(context, update) {
      const { commit } = context;
      commit('SET_DOT_UPDATE', update);
    },

    // --------------------------------------------------------- Diag Management

    ADD_DOT_TO_INSPECT(context, dot) {
      const { commit } = context;
      commit('ADD_DOT_TO_INSPECT', dot);
    },

    REMOVE_DOT_TO_INSPECT(context, dotID) {
      const { commit } = context;
      commit('REMOVE_DOT_TO_INSPECT', dotID);
    },

  },

  /* eslint-disable no-param-reassign */
  mutations: {

    SET_WORLD(state, world) {
      state.world = world;
    },

    SET_DOT_UPDATE(state, update) {
      const dotID = update.id;
      const dotData = update.dotData;

      state.world.dotRegistry[dotID] = dotData;
    },

    ADD_DOT_TO_INSPECT(state, dotID) {
      if (dotID) state.dotsToInspect.push(dotID);
    },

    REMOVE_DOT_TO_INSPECT(state, dotID) {
      const index = state.dotsToInspect.indexOf(dotID);
      if (dotID && index > -1) {
        state.dotsToInspect.splice(index, 1);
      }
    },

  }, // END - mutations
  /* eslint-enable no-param-reassign */
};

export default dotWorldData;
