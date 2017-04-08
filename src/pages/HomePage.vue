<template>
  <div class="home-page page">
    <h1>lucagen</h1>
    <div class="version">{{ webVersion }}</div>
  </div>
</template>

<script>
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
