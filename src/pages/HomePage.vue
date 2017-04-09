<template>
  <div class="home-page page">
    <div class="page-header">
      <h1>lucagen</h1>
      <div class="version">{{ webVersion }}</div>
    </div>

    <div class="page-body">
      <div class="viz-canvas">
        <dot v-for="(node, index) in taxaRoot"
             v-bind:key="'n-' + node.id"
             v-bind:index="index" />
      </div>
    </div>
  </div>
</template>

<script>
import Dot from '../components/Dot';

export default {
  name: 'HomePage',

  computed: {
    webVersion() {
      return this.$store.getters.webVersion;
    },
    taxaRoot() {
      return this.$store.getters.taxaRoot;
    },
  },

  beforeMount() {
    this.$store.dispatch('LOAD_TAXA_ROOT');
  },

  mounted() {
  },

  components: {
    Dot,
  },
};
</script>

<style scoped>
  .viz-canvas {
    
  }
</style>
