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

  }, // END - state

  getters: {

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

    CREATE_WORLD(context, worldData) {
      const { commit } = context;

      // Parse world configuration...
      const name = objectUtils.get(worldData, 'name', null);
      const width = objectUtils.get(worldData, 'width', 400);
      const height = objectUtils.get(worldData, 'height', 200);
      const dots = objectUtils.get(worldData, 'dots', []);

      // Create world...
      const world = new World({
        name,
        width,
        height,
      });

      // Populate with pioneers...
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

    NOTIFY_DOT_UPDATE(context, update) {
      const { commit } = context;
      commit('SET_DOT_UPDATE', update);
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

  }, // END - mutations
  /* eslint-enable no-param-reassign */
};

export default dotWorldData;
