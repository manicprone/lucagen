<template>
  <div ref="dotSpace" v-bind:class="dotSpaceClasses" v-on:click="toggle">
    <div ref="dot" v-bind:class="dotClasses" v-on:mouseover="pulse"></div>
  </div>
</template>

<script>
import Velocity from 'velocity-animate';

export default {
  name: 'Dot',

  props: [
    'type',
    'index',
    'id',
  ],

  data: () => {
    return {
      isPaused: true,
    };
  },

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
    world() {
      return this.$store.getters.dotWorld;
    },
    worldRegistry() {
      return this.$store.getters.dotWorldRegistry;
    },
    self() {
      return this.worldRegistry[this.id];
    },
  },

  watch: {
    self(/* value */) {
      // console.log(`Dot ${this.self.name} updated =>`, value);
      if (!this.isPaused) this.move();
    },
  },

  beforeMount() {
    // Calculate birthplace...
  },

  mounted() {
    // If first to act, move...
    // this.move();
  },

  destroyed() {
    console.log(`[DOT] "${this.self.id}" was destroyed.`);
  },

  methods: {
    toggle() {
      if (this.isPaused) {
        console.log(`[DOT] "${this.self.id}" has awoken`);
        this.resume();
      } else {
        console.log(`[DOT] "${this.self.id}" is sleeping`);
        this.pause();
      }
    },
    resume() {
      this.isPaused = false;
      this.move();
    },
    pause() {
      this.isPaused = true;
    },
    pulse() {
      // console.log('(( . ))');
    },
    notify(moveInfo) {
      // Apply move info...
      this.self.applyMove(moveInfo);

      // Notify store...
      const update = { id: this.self.id, dotData: this.self };
      this.$store.dispatch('NOTIFY_DOT_UPDATE', update);
    },
    // -------------------------- Moves
    move() {
      console.log(`[DOT] "${this.self.id}" is moving =>`, this.self);
      const nextMove = this.self.getNextMove(this.world);
      const currSpeed = Number(this.self.speed);

      // Obtain dot DOM element...
      const obj = this.$refs.dotSpace;

      // Execute move on DOM element...
      Velocity(obj, nextMove.instruction, {
        duration: currSpeed,
        complete: () => { this.notify(nextMove.endState); },
      });
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
    left: 0px;
    bottom: -191px;
  }

  .dot {
    margin: 0 auto;
    height: 1px;
    width: 1px;
    background-color: #e9e9e9;
    border: 1px solid #525252;
    border-radius: 1px;
  }
</style>
