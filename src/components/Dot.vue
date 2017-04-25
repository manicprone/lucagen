<template>
  <div ref="dotSpace" v-bind:class="dotSpaceClasses" v-bind:style="dotSpaceStyles">
    <div ref="dot" v-bind:class="dotClasses" v-on:mouseover="pulse"></div>
  </div>
</template>

<script>
import Velocity from 'velocity-animate';
import objectUtils from '../utils/object-utils';

export default {
  name: 'Dot',

  props: [
    'type',
    'id',
  ],

  computed: {
    world() {
      return this.$store.getters.dotWorld;
    },
    dotRegistry() {
      return this.$store.getters.dotWorldRegistry;
    },
    self() {
      return this.dotRegistry[this.id];
    },
    dotSpaceClasses() {
      const base = 'dot-space';
      switch (this.type) {
        case 'grid': return `${base} grid-item`;
        case 'life': return `${base} life`;
        default: return base;
      }
    },
    dotSpaceStyles() {
      return (this.self)
        ? { left: `${this.self.birthLeft}px`, top: `${this.self.birthTop}px` }
        : {};
    },
    dotClasses() {
      const base = 'dot';
      switch (this.type) {
        default: return base;
      }
    },
  },

  mounted() {
    console.log(`[DOT] Welcome "${this.self.name}" to "${this.world.name}" =>`, this.self);
  },

  updated() {
    if (!this.self.isAsleep && this.world.freedomMode) this.move();
  },

  destroyed() {
    console.log(`[DOT] "${this.self.name}" has died.`);
  },

  methods: {
    pulse() {
      // console.log('(( . ))');
    },
    notify(moveInfo) {
      // Apply move info...
      this.self.applyMove(moveInfo);

      // TODO: this.self.evaluate !!!

      // Notify store...
      const update = { id: this.self.id, dotData: this.self };
      this.$store.dispatch('NOTIFY_DOT_UPDATE', update);
    },
    // -------------------------- Moves
    move() {
      // Obtain next move and current speed...
      const nextMove = this.self.getNextMove(this.world);

      // Obtain dot DOM element...
      const obj = this.$refs.dotSpace;

      // Parse move info...
      const instruction = nextMove.instruction;
      const currSpeed = nextMove.speed;
      const endState = nextMove.endState;

      // Execute move on DOM element...
      if (!objectUtils.isEmpty(instruction)) {
        Velocity(obj, instruction, {
          duration: currSpeed,
          complete: () => { this.notify(endState); },
        });
      }
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
    position: absolute;
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
