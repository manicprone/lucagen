<template>
  <div class="reality-page page">
    <div class="page-header">
      <h1>lucagen</h1>
      <div class="version">reality</div>
    </div>

    <div class="page-body">
      <div class="viz-canvas">
        <dot v-bind:type="'life'"
             v-bind:index="'0'"
             v-bind:id="'lonely'" />
      </div>
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
  },

  beforeMount() {
  },

  mounted() {
  },

  components: {
    Dot,
  },
};
</script>

<style scoped>
</style>
