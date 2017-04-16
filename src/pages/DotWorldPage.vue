<template>
  <div class="dot-world-page page">

    <div class="world-stats-col col">
      <div v-if="world" class="world-stats-container">
        World Stats
      </div>
    </div>

    <div class="world-col col">
      <transition name="fade">
        <div v-if="world" class="world-container">
          <dot ref="dot-lonely"
               v-bind:type="'life'"
               v-bind:index="'0'"
               v-bind:id="'lonely'" />
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
        <dot-diag v-if="dotToInspect"
                  v-bind:dot="dotToInspect"/>
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
    lifeToggleLabel() {
      return (this.isPaused) ? 'Wake' : 'Sleep';
    },
    stepLabel() {
      return 'Step';
    },
    stepActionClasses() {
      return (this.isPaused)
        ? 'step-action'
        : 'step-action disabled';
    },
    stepActionLinkClasses() {
      return (this.isPaused)
        ? 'step-action-link'
        : 'step-action-link disabled';
    },
    worldRegistry() {
      return this.$store.getters.dotWorldRegistry;
    },
    dotToInspect() {
      const dotID = 'lonely';
      return this.worldRegistry[dotID];
    },
  },

  beforeMount() {
    // Create Lonely World...
    const lonely = {
      id: 'lonely',
      name: 'Lonely',
      index: 0,
      width: 9,
      height: 9,
      birthX: 1,
      birthY: 262,
      speed: 200,
    };
    const world = {
      name: 'Lonely World',
      width: 450,
      height: 270,
      dots: [lonely],
    };
    this.$store.dispatch('CREATE_WORLD', world);
  },

  mounted() {
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
      this.world.setFreedom(true);
      this.world.resumeDots();
      this.isPaused = false;
    },
    pauseLife() {
      this.world.setFreedom(false);
      this.world.pauseDots();
      this.isPaused = true;
    },
    step() {
      this.$refs['dot-lonely'].move();
    },
  },

  components: {
    Dot,
    DotDiag,
  },
};
</script>

<style scoped>
  /* Page layout */
  .dot-world-page {
    margin: 30px;
  }
  .world-stats-col {
    width: 340px;
  }
  .world-col {
    width: 510px;
  }
  .dot-inspect-col {

  }

  .world-container {
    width: 450px;
    height: 270px;
    border: 1px solid #ff9977;
    margin: 0 auto;
  }

  .world-controls-container {
    margin: 20px 0 0 0;
  }
  .world-controls {
    margin: 0 auto;
  }
  .step-action {
    margin-left: 90px;
  }
  .step-action.disabled {
    cursor: not-allowed;
  }
  .step-action-link.disabled {
    color: #b9b9b9;
  }
</style>
