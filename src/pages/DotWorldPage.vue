<template>
  <div class="dot-world-page page">

    <div class="world-management-col col">
      <div v-if="world" class="world-management-container">
        <div>
          <span v-bind:class="addDotActionClasses">
            <a v-bind:class="addDotActionLinkClasses" v-on:click="addDotToWorld">{{ addDotLabel }}</a>
          </span>
        </div>
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
    addDotLabel() {
      return 'Add Dot';
    },
    addDotActionClasses() {
      return (this.isPaused)
        ? 'add-dot-action action'
        : 'add-dot-action action disabled';
    },
    addDotActionLinkClasses() {
      return (this.isPaused)
        ? 'add-dot-action-link action-link'
        : 'add-dot-action-link action-link disabled';
    },
  },

  beforeMount() {
    const lonely = {
      id: 'lonely',
      name: 'Lonely',
      birthX: 1,
      birthY: 262,
      speed: 200,
      memoryDepth: 5,
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
    addDotToWorld() {
      if (this.isPaused) {
        const dot = {
          id: 'friendly',
          name: 'Friendly',
          birthX: 1,
          birthY: 1,
          speed: 200,
          memoryDepth: 5,
        };
        this.$store.dispatch('ADD_DOT_TO_WORLD', dot);
      }
    },
  },

  components: {
    Dot,
    DotDiag,
  },
};
</script>

<style scoped>
  /* Page Layout */
  .dot-world-page {
    margin: 30px;
  }
  .world-management-col {
    width: 340px;
    height: 50px;
  }
  .world-col {
    width: 510px;
  }
  .dot-inspect-col {
    margin-bottom: 20px;
  }

  /* World */
  .world-container {
    position: relative;
    width: 450px;
    height: 270px;
    border: 1px solid #ff9977;
    margin: 0 auto;
  }

  /* World Controls */
  .world-controls-container {
    margin: 20px 0 0 0;
  }
  .world-controls {
    margin: 0 auto 15px auto;
  }
  .action.disabled {
    cursor: not-allowed;
  }
  .action-link.disabled {
    color: #b9b9b9;
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
