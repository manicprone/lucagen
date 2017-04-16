<template>
  <div class="dot-world-page page">

    <div class="col-xs-12 col-md-4">
      <div v-if="world" class="world-stats-container">
        World Stats
      </div>
    </div>

    <div class="col-xs-12 col-md-4">
      <transition name="fade">
        <div v-if="world" class="world-container">
          <dot v-bind:type="'life'"
               v-bind:index="'0'"
               v-bind:id="'lonely'" />
        </div>
      </transition>

      <div v-if="world" class="world-controls-container">
        <div class="world-controls">
          <span><a v-on:click="toggleLife">{{ lifeToggleLabel }}</a></span>
        </div>
      </div>
    </div>

    <div class="col-xs-12 col-md-4">
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
      birthX: 0,
      birthY: 191,
      speed: 200,
    };
    const world = {
      name: 'Lonely World',
      width: 400,
      height: 200,
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
      this.world.resumeDots();
      this.isPaused = false;
    },
    pauseLife() {
      this.world.pauseDots();
      this.isPaused = true;
    },
  },

  components: {
    Dot,
    DotDiag,
  },
};
</script>

<style scoped>
  .dot-world-page {
    margin: 30px;
  }

  .world-container {
    width: 400px;
    height: 200px;
    border: 1px solid #ff9977;
    margin: 0 auto;
  }

  .world-controls-container {
    margin: 20px 0 0 0;
  }

  .world-controls {
    width: 100px;
    margin: 0 auto;
  }
</style>
