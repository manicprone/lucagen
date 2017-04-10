<template>
  <div class="home-page page">
    <div class="page-header">
      <h1>lucagen</h1>
      <div class="version">{{ webVersion }}</div>
    </div>

    <div class="page-body">
      <div class="viz-canvas grid">
        <dot v-for="(node, index) in taxaRoot"
             v-bind:type="'grid'"
             v-bind:key="'n-' + node.id"
             v-bind:index="index" />
      </div>
    </div>
  </div>
</template>

<script>
import Masonry from 'masonry-layout';
import Dot from '../components/Dot';

export default {
  name: 'HomePage',

  data: () => {
    return {
      canvas: null,
    };
  },

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
    const vizCanvas = document.querySelector('.grid');
    this.canvas = new Masonry(vizCanvas, {
      itemSelector: '.grid-item',
      columnWidth: 40,
    });
  },

  components: {
    Dot,
  },
};
</script>

<style scoped>
</style>
