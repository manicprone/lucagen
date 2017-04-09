<template>
  <div class="dot-space" v-on:click="expand">
    <span class="dot" v-on:mouseover="pulse"></span>
  </div>
</template>

<script>
export default {
  name: 'Dot',

  props: [
    'index',
    'item',
  ],

  computed: {
    matter() {
      return '.';
    },
  },

  mounted() {
  },

  methods: {
    pulse() {
      console.log('(( . ))');
    },
    expand() {
      console.log('!!!');
    },
  },
};
</script>

<style scoped>
  .dot-space {
    padding: 4px;
    display: inline-block;
    cursor: pointer;
  }

  .dot {
    width: 2px;
    height: 2px;
    background-color: #010101;
    display: block;
  }
</style>
