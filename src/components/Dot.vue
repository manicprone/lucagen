<template>
  <div class="dot-space grid-item" v-on:click="expand">
    <div class="dot" v-on:mouseover="pulse"></div>
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
    float: left;
    height: 9px;
    width: 9px;
    border-radius: 3px;
    cursor: pointer;
  }
  .dot-space:hover {
    background-color: #f2f2f2;
  }

  .dot {
    margin: 3px auto 0 auto;
    height: 1px;
    width: 1px;
    background-color: #e9e9e9;
    border: 1px solid #525252;
    border-radius: 1px;
  }
</style>
