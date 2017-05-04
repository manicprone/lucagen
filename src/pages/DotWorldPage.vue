<template>
  <div class="dot-world-page page">

    <div class="world-management-col col">
      <div v-if="world" class="world-management-container">
        <dot-creator />
      </div>
    </div>

    <div class="world-col col">
      <transition name="fade">
        <div ref="dot-world" v-if="world" class="world-container">
          <dot v-for="dotID in dotIDs"
               v-bind:ref="'dots'"
               v-bind:key="'dot-' + dotID"
               v-bind:id="dotID" />
        </div>
      </transition>

      <div v-if="world" class="world-controls-container">
        <div class="world-controls">
          <span><a v-on:click="toggleLife">{{ lifeToggleLabel }}</a></span>
          <span v-bind:class="stepActionClasses">
            <a v-bind:class="stepActionLinkClasses" v-on:click="step">{{ stepLabel }}</a>
          </span>
        </div>
      </div>
    </div>

    <div class="dot-inspect-col col">
      <div class="dot-inspect-container">
        <transition-group name="fade-fast">
          <dot-diag v-for="dot in dotsToInspect"
                    v-bind:ref="'dotDiags'"
                    v-bind:key="'dot-diag-' + dot.id"
                    v-bind:dot="dot"/>
        </transition-group>
      </div>
    </div>

  </div>
</template>

<script>
import Dot from '../components/Dot';
import DotDiag from '../components/DotDiag';
import DotCreator from '../components/DotCreator';

export default {
  name: 'DotWorldPage',

  data: () => {
    return {
      isPaused: true,
    };
  },

  computed: {
    world() {
      return this.$store.getters.dotWorld;
    },
    dotIDs() {
      return this.world.dots;
    },
    dotRegistry() {
      return this.$store.getters.dotWorldRegistry;
    },
    dotsToInspect() {
      const dots = [];
      const dotIDs = this.$store.getters.dotsToInspect;
      if (this.world.dotRegistry) {
        dotIDs.forEach((dotID) => {
          dots.push(this.world.dotRegistry[dotID]);
        });
      }
      return dots;
    },
    lifeToggleLabel() {
      return (this.isPaused) ? 'Wake' : 'Sleep';
    },
    stepLabel() {
      return 'Step';
    },
    stepActionClasses() {
      return (this.isPaused)
        ? 'step-action action'
        : 'step-action action disabled';
    },
    stepActionLinkClasses() {
      return (this.isPaused)
        ? 'step-action-link action-link'
        : 'step-action-link action-link disabled';
    },
  },

  beforeMount() {
    const lonely = {
      id: 'lonely',
      name: 'Lonely',
      birthX: 1,
      birthY: 262,
      emotionalConfig: { s: 1 },
    };
    const world = {
      name: 'Lonely World',
      width: 450,
      height: 270,
      dots: [lonely],
    };

    // Create Lonely World...
    this.$store.dispatch('CREATE_WORLD', world);
  },

  methods: {
    toggleLife() {
      if (this.isPaused) {
        this.resumeLife();
      } else {
        this.pauseLife();
      }
    },
    resumeLife() {
      this.$store.dispatch('RESUME_LIFE');
      this.isPaused = false;
    },
    pauseLife() {
      this.$store.dispatch('PAUSE_LIFE');
      this.isPaused = true;
    },
    step() {
      if (this.isPaused) {
        this.$refs.dots.forEach((dot) => {
          dot.move();
        });
      }
    },
  },

  components: {
    Dot,
    DotDiag,
    DotCreator,
  },
};
</script>

<style scoped>
  /* Page Layout */
  .dot-world-page {
    margin: 30px;
  }
  .world-management-col {
    width: 300px;
    margin: 0 0 30px 30px;
  }
  .world-col {
    width: 510px;
    margin-right: 20px;
  }
  .dot-inspect-col {
    margin-bottom: 20px;
  }

  /* World */
  .world-container {
    position: relative;
    width: 450px;
    height: 270px;
    border: 1px solid #b9b9b9;
    margin: 0 auto;
    background-color: #ffffff;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, .5);
  }

  /* World Controls */
  .world-controls-container {
    margin: 20px 0 20px 0;
  }
  .world-controls {
    margin: 0 auto;
  }
  .step-action {
    margin-left: 90px;
  }

  /* Dot Inspect / Diags */
  .dot-inspect-container .dot-diag {
    float: left;
    margin-right: 8px;
  }
</style>
