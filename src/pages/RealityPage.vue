<template>
  <div class="reality-page page">
    <transition name="fade" appear>
      <div class="page-header">
        <h1>lucagen</h1>
        <div class="version">reality</div>
      </div>
    </transition>

    <div class="page-body">
      <transition name="fade">
        <div v-if="dotWorld" class="world-container">
          <dot v-bind:type="'life'"
               v-bind:index="'0'"
               v-bind:id="'lonely'"
               v-bind:name="'Lonely'" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Dot from '../components/Dot';

export default {
  name: 'RealityPage',

  computed: {
    webVersion() {
      return this.$store.getters.webVersion;
    },
    dotWorld() {
      return this.$store.getters.dotWorld;
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
      x: 0,
      y: 0,
      speed: 2000,
    };
    const world = {
      // name: 'Lonely World',
      width: 400,
      height: 200,
      dots: [lonely],
    };
    this.$store.dispatch('CREATE_WORLD', world);
  },

  mounted() {
  },

  components: {
    Dot,
  },
};
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 2s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .world-container {
    width: 400px;
    height: 200px;
    border: 1px solid #ff9977;
    margin: 0 auto;
  }
</style>
