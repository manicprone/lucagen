<template>
  <div class="reality-page page">
    <div class="page-body">

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
  </div>
</template>

<script>
import Dot from '../components/Dot';

export default {
  name: 'RealityPage',

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
      birthY: 0,
      speed: 800,
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
  },
};
</script>

<style scoped>
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
