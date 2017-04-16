<template>
  <div ref="dotDiag" v-bind:class="dotDiagClasses">
    <transition name="fade">
      <div v-if="dot">
        <div class="header">
          {{ dot.name }}
        </div>

        <div class="diag-movement-ui">
          <div class="diag-movement-x-values">
            <div class="diag-value diag-value-x1">{{ dot.x1 }}</div>
            <div class="diag-value diag-value-x2">{{ dot.x2 }}</div>
          </div>
          <div class="diag-square-x-labels">
            <div class="diag-label diag-label-x1">x1</div>
            <div class="diag-label diag-label-x2">x2</div>
          </div>
          <div class="diag-square-container">
            <div class="diag-movement-y-values col">
              <div class="diag-value diag-value-y1">{{ dot.y1 }}</div>
              <div class="diag-value diag-value-y2">{{ dot.y2 }}</div>
            </div>
            <div class="diag-square-y-labels col">
              <div class="diag-label diag-label-y1">y1</div>
              <div class="diag-label diag-label-y2">y2</div>
            </div>
            <div class="diag-square col"></div>
            <div class="diag-movement-from-x col">
              <div class="diag-label diag-label-from-x">fromX</div>
              <div class="diag-value diag-value-from-x">{{ dot.fromX }}</div>
            </div>
            <div class="diag-movement-from-y col">
              <div class="diag-label diag-label-from-y">fromY</div>
              <div class="diag-value diag-value-from-y">{{ dot.fromY }}</div>
            </div>
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
    margin: 0 0 15px 45px;
    padding-bottom: 10px;
    text-align: right;
    border-bottom: 1px solid #d9d9d9;
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

  .diag-movement-ui {
    margin: 0 auto;
    height: 120px;
  }

  /* x info */
  .diag-movement-x-values {
    line-height: 15px;
    margin: 0 0 0 -8px;
  }
  .diag-value-x1 {
    margin-right: 28px;
  }
  .diag-value-x2 {
    margin-right: 9px;
  }
  .diag-square-x-labels {
    line-height: 12px;
    margin: 0 0 3px -11px;
  }
  .diag-label-x1 {
    margin: 0 19px 0 0;
  }
  .diag-label-x2 {
    margin-right: 5px;
  }

  /* square */
  .diag-square-container {
    height: 49px;
    margin-left: 31px;
  }
  .diag-square-container .col {
    float: left;
  }
  .diag-square-container .diag-label,
  .diag-square-container .diag-value {
    display: block;
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

  /* y info */
  .diag-movement-y-values {
    line-height: 15px;
    width: 40px;
    text-align: right;
  }
  .diag-value-y1 {
    margin-bottom: 21px;
  }
  .diag-value-y2 {
  }
  .diag-square-y-labels {
    margin: 0 4px 0 7px;
  }
  .diag-label-y1 {
    margin-bottom: 21px;
    font-size: 10px;
  }
  .diag-label-y2 {
    font-size: 10px;
  }

  /* fromX info */
  .diag-movement-from-x {
    margin: 8px 0 0 12px;
    width: 40px;
    text-align: center;
  }
  .diag-value-from-x {
    line-height: 16px;
  }
  .diag-label-from-x {
    line-height: 14px;
  }

  /* fromY info */
  .diag-movement-from-y {
    margin: 8px 0 0 12px;
    width: 40px;
    text-align: center;
  }
  .diag-value-from-y {
    line-height: 16px;
  }
  .diag-label-from-y {
    line-height: 14px;
  }
</style>
