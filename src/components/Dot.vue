<template>
  <div ref="dotSpace" v-bind:class="dotSpaceClasses" v-bind:style="dotSpaceStyles"
       v-on:mouseover="showFlyoverInfo">

    <div ref="dot" v-bind:class="dotClasses">
      <div ref="dotFlyover" v-bind:class="dotFlyoverClasses">
        <div class="icon-close-flyover" v-on:click="hideFlyoverInfo">
          <a>X</a>
        </div>
        <div class="flyover-info">
          {{ self.name }}
        </div>
        <div class="flyover-actions">
          <a v-bind:class="dotDiagToggleClasses" v-on:click="toggleDotDiag">D</a>
        </div>
      </div>

      <div class="emotional-quadrant q-1-1"></div>
      <div class="emotional-quadrant q-1-2"></div>
      <div class="emotional-quadrant q-1-3"></div>

      <div class="emotional-quadrant q-2-1"></div>
      <div class="emotional-quadrant q-2-2" v-bind:style="ntQuadrant2_2_Styles"></div>
      <div class="emotional-quadrant q-2-3"></div>

      <div class="emotional-quadrant q-3-1"></div>
      <div class="emotional-quadrant q-3-2"></div>
      <div class="emotional-quadrant q-3-3"></div>
    </div>

  </div>
</template>

<script>
import Velocity from 'velocity-animate';
import objectUtils from '../utils/object-utils';

// <div class="emotional-quadrant q-3-2" v-bind:style="{ 'background-color': renderNTColor(1) }"></div>

export default {
  name: 'Dot',

  props: [
    'id',
  ],

  data: () => {
    return {
      showFlyover: false,
      isDiagOpen: false,
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
      return 'dot-space';
    },
    dotSpaceStyles() {
      return (this.self)
        ? { left: `${this.self.birthLeft}px`, top: `${this.self.birthTop}px` }
        : {};
    },
    dotClasses() {
      return 'dot';
    },
    dotFlyoverClasses() {
      const base = 'dot-flyover';
      return (this.showFlyover)
        ? `${base} show`
        : `${base}`;
    },
    dotDiagToggleClasses() {
      const base = 'dot-diag-toggle';
      return (this.isDiagOpen)
        ? `${base} active`
        : `${base}`;
    },
    ntQuadrant1_2_Styles() {
      const nt = (this.self) ? this.self.emotionalConfig.d : -1;
      return { 'background-color': `${this.renderNTColor(nt)}` };
    },
    ntQuadrant2_2_Styles() {
      const nt = (this.self) ? this.self.emotionalConfig.s : -1;
      return { 'background-color': `${this.renderNTColor(nt)}` };
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
    toggleDotDiag() {
      if (!this.isDiagOpen) this.openDotDiag();
      else this.closeDotDiag();
    },
    openDotDiag() {
      if (this.self) {
        this.isDiagOpen = true;
        this.$store.dispatch('ADD_DOT_TO_INSPECT', this.self.id);
      }
    },
    closeDotDiag() {
      if (this.self) {
        this.isDiagOpen = false;
        this.$store.dispatch('REMOVE_DOT_TO_INSPECT', this.self.id);
      }
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
    renderNTColor(nt) {
      // console.log('nt =>', nt);
      // const value = this.self.emotionalConfig[nt];
      const value = nt;
      switch (value) {
        case 1: return '#9cc8f4';
        case 2: return '#225fd9';
        case 3: return '#05398c';
        default: return 'transparent';
      }
    },
  },
};
</script>

<style scoped>
  .dot-space {
    position: absolute;
    height: 9px;
    width: 9px;
    cursor: pointer;
  }
  /*.dot-space {
    position: absolute;
    height: 9px;
    width: 9px;
    border-radius: 3px;
    cursor: pointer;
  }
  .dot-space:hover {
    background-color: #f2f2f2;
  }*/

  /* emotional realm */
  .dot {}
  /*.dot {
    margin: 0 auto;
    height: 1px;
    width: 1px;
    background-color: #e9e9e9;
    border: 1px solid #525252;
    border-radius: 1px;
  }*/
  .dot .emotional-quadrant {
    height: 3px;
    width: 3px;
    float: left;
    background-color: transparent;
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
    background-color: rgba(0, 0, 0, 0.35);
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
    border-color: #000000 transparent transparent transparent;
    opacity: 0.35;
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
    padding: 0 2px;
    border-radius: 2px;
  }
  .flyover-actions a.active {
    background-color: rgba(0, 0, 0, 0.4);
  }
</style>
