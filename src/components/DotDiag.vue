<template>
  <div ref="dotDiag" v-bind:class="dotDiagClasses">
    <transition name="fade">
      <div v-if="dot">
        <div class="header">
          {{ dot.name }}
        </div>

        <div class="diag-movement">
          <div class="diag-movement-x-values">
            <div class="diag-value diag-value-x1">{{ dot.x1 }}</div>
            <div class="diag-value diag-value-x2">{{ dot.x2 }}</div>
          </div>
          <div class="diag-square-x-labels">
            <div class="diag-label diag-label-x1">x1</div>
            <div class="diag-label diag-label-x2">x2</div>
          </div>
          <div class="diag-square-container">
            <div class="diag-square-y-labels col">
              <div class="diag-label diag-label-y1">y1</div>
              <div class="diag-label diag-label-y2">y2</div>
            </div>
            <div class="diag-square col"></div>
            <div class="col"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import objectUtils from '../utils/object-utils';

export default {
  name: 'DotDiag',

  props: [
    'dot',
  ],

  computed: {
    dotDiagClasses() {
      return 'dot-diag';
    },
  },

  methods: {
  },
};
</script>

<style scoped>
  .header {
    margin-bottom: 12px;
  }

  .diag-label {
    display: inline;
    font-size: 11px;
    color: #888888;
  }
  .diag-value {
    display: inline;
    font-size: 15px;
    color: #121212;
  }

  /* -------------------- Diag UI: Movement */

  .diag-movement {
    margin: 0 auto;
    height: 120px;
    width: 120px;
  }
  .diag-movement-x-values {
    line-height: 15px;
    margin: 0 0 0 -7px;
  }
  .diag-value-x1 {
    margin-right: 32px;
  }
  .diag-value-x2 {
    margin-right: 5px;
  }
  .diag-square-x-labels {
    line-height: 12px;
    margin: 0 0 3px -7px;
  }
  .diag-label-x1 {
    margin: 0 19px 0 0;
  }
  .diag-label-x2 {
    margin-right: 5px;
  }
  .diag-square-container .col {
    float: left;
  }
  .diag-square-container .diag-label {
    display: block;
  }
  .diag-square-y-labels {
    margin: 0 4px 0 15px;
  }
  .diag-label-y1 {
    margin-bottom: 21px;
    font-size: 10px;
  }
  .diag-label-y2 {
    font-size: 10px;
  }
  .diag-square {
    margin: 0 auto;
    font-size: 10px;
    line-height: 10px;
    color: #666666;
    border: 1px solid #aaaaaa;
    height: 47px;
    width: 47px;
  }
</style>
