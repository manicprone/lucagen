<template>
  <div ref="dotSpace" v-bind:class="dotSpaceClasses" v-on:click="describe">
    <div ref="dot" v-bind:class="dotClasses" v-on:mouseover="pulse"></div>
  </div>
</template>

<script>
export default {
  name: 'Dot',

  props: [
    'type',
    'index',
    'id',
  ],

  computed: {
    dotSpaceClasses() {
      const base = 'dot-space';
      switch (this.type) {
        case 'grid': return `${base} grid-item`;
        case 'life': return `${base} life`;
        default: return base;
      }
    },
    dotClasses() {
      const base = 'dot';
      switch (this.type) {
        default: return base;
      }
    },
    dotWorld() {
      return this.$store.getters.dotWorld;
    },
    dotWorldRegistry() {
      return this.$store.getters.dotWorldRegistry;
    },
    self() {
      return this.dotWorldRegistry[this.id];
    },
  },

  beforeMount() {
    // Calculate birthplace...
  },

  mounted() {
    // If first to act, move...
    this.move();
  },

  beforeUpdate() {
    // Evaluate, evolve...
  },

  updated() {
    // React, move...
    this.move();
  },

  destroyed() {
    console.log('[DOT] destroyed.');
  },

  methods: {
    pulse() {
      console.log('(( . ))');
    },
    describe() {
      console.log('!!!');
    },
    // -------------------------- Life Actions
    getInfo() {
    },
    move() {
      const obj = this.$refs.dotSpace;
      console.log('[DOT] obj =>', obj);

      const currLeft = this.$refs.dotSpace.style.left;
      console.log(`[DOT] ${this.id} style:`, this.$refs.dotSpace.style);
      const newLeft = currLeft + 1;

      console.log(`[DOT] ${this.id} moving ${currLeft}=>${newLeft}`);
    },
    moveE() {
    },
  },
};
</script>

<style scoped>
  .dot-space {
    height: 9px;
    width: 9px;
    border-radius: 3px;
    cursor: pointer;
  }
  .dot-space:hover {
    background-color: #f2f2f2;
  }

  /* Dot type variations */
  .dot-space.grid-item {
    float: left;
  }
  .dot-space.life {
    position: relative;
    top: 0px;
    left: 0px;
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
