<template>
  <div ref="dotSpace"
       v-bind:class="dotSpaceClasses"
       v-bind:style="dotSpaceStyles"
       v-on:mouseover="showFlyoverInfo">
    <div ref="dot" v-bind:class="dotClasses">
      <div ref="dotFlyover" v-bind:class="dotFlyoverClasses">
        <div class="icon-close-flyover" v-on:click="hideFlyoverInfo"><a>X</a></div>
        <div class="flyover-info">{{ self.name }}</div>
        <div class="flyover-actions"><a>D</a></div>
      </div>
    </div>
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

  data: () => {
    return {
      showFlyover: false,
    };
  },

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
    dotFlyoverClasses() {
      const base = 'dot-flyover';
      return (this.showFlyover)
        ? `${base} show`
        : `${base}`;
    },
  },

  mounted() {
    console.log(`[UI] Welcome "${this.self.name}" to "${this.world.name}" =>`, this.self);
  },

  updated() {
    if (!this.self.isAsleep && this.world.freedomMode) this.move();
  },

  destroyed() {
    console.log(`[UI] "${this.self.name}" has died.`);
  },

  methods: {
    showFlyoverInfo() {
      if (this.$parent.isPaused) this.showFlyover = true;
    },
    hideFlyoverInfo() {
      if (this.$parent.isPaused) this.showFlyover = false;
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

  /* Dot flyover */
  .dot-flyover {
    position: absolute;
    bottom: 100%;
    left: 50%;
    z-index: 9999;
    width: 100px;
    margin: 0 0 6px -55px;
    padding: 2px 6px 4px 6px;
    border-radius: 6px;
    background-color: #666666;
    color: #ffffff;
    text-align: center;
    visibility: hidden;
  }
  .dot-flyover::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    z-index: 9999;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #666666 transparent transparent transparent;
  }
  .dot-flyover.show {
    visibility: visible;
  }
  .dot-flyover a {
    color: #cccccc;
    font-size: 11px;
    line-height: 11px;
  }
  .dot-flyover a:hover {
    color: #ffffff;
  }
  .icon-close-flyover {
    float: left;
  }
  .flyover-info {
    display: inline-block;
    font-size: 12px;
  }
  .flyover-actions {
    float: right;
    margin: 0;
  }
  .flyover-actions a {
    font-size: 12px;
    line-height: 12px;
  }
</style>
