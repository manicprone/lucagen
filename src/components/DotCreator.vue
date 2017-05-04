<template>
  <div ref="dotCreator" v-bind:class="dotCreatorClasses">
    <div class="form-create-dot">

      <div class="dot-data col">
        <div class="row">
          <!-- name -->
          <div class="input-container">
            <input type="text"
                   ref="dotName"
                   name="dotName"
                   size="13"
                   maxlength="30"
                   placeholder="Dot Name"
                   v-model="newDotName" />
          </div>

          <!-- birthX -->
          <div class="input-container">
            <input type="text"
                   class="input-number"
                   ref="dotBirthX"
                   name="dotBirthX"
                   size="2"
                   maxlength="4"
                   placeholder="x"
                   v-model="newDotBirthX" />

            <span class="comma-delimiter">,</span>

            <!-- birthY -->
            <input type="text"
                   class="input-number"
                   ref="dotBirthY"
                   name="dotBirthY"
                   size="2"
                   maxlength="4"
                   placeholder="y"
                   v-model="newDotBirthY" />
          </div>
        </div>

        <!-- <div class="row">
          <details>
            <summary></summary>

            <label class="input-label">Speed</label>
            <div class="input-container">
              <input type="text"
                     class="input-number"
                     ref="dotSpeed"
                     name="dotSpeed"
                     size="4"
                     maxlength="4"
                     v-model="newDotSpeed" />
            </div>
          </details>
        </div> -->
      </div> <!-- END (.dot-data .col) -->

      <div class="controls col">
        <div v-bind:class="addDotActionClasses">
          <a v-bind:class="addDotActionLinkClasses" v-on:click="addDotToWorld">{{ addDotLabel }}</a>
        </div>
      </div>

    </div> <!-- END (.form-create-dot) -->
  </div>
</template>

<script>
export default {
  name: 'DotCreator',

  props: [],

  data() {
    return {
      newDotName: null,
      newDotBirthX: null,
      newDotBirthY: null,
      newDotSpeed: null,
    };
  },

  computed: {
    dotCreatorClasses() {
      return 'dot-creator';
    },
    addDotLabel() {
      return 'Add Dot';
    },
    addDotActionClasses() {
      return (this.$parent.isPaused)
        ? 'add-dot-action action'
        : 'add-dot-action action disabled';
    },
    addDotActionLinkClasses() {
      return (this.$parent.isPaused)
        ? 'add-dot-action-link action-link'
        : 'add-dot-action-link action-link disabled';
    },
  },

  methods: {
    addDotToWorld() {
      if (this.$parent.isPaused) {
        const dot = {};
        if (this.newDotName) dot.name = this.newDotName;
        if (this.newDotBirthX) dot.birthX = Number(this.newDotBirthX);
        if (this.newDotBirthY) dot.birthY = Number(this.newDotBirthY);
        if (this.newDotSpeed) dot.speed = Number(this.newDotSpeed);
        dot.emotionalConfig = { s: 3 };

        this.$store.dispatch('ADD_DOT_TO_WORLD', dot)
          .then(() => this.resetForm());
      }
    },
    resetForm() {
      this.newDotName = null;
      this.newDotBirthX = null;
      this.newDotBirthY = null;
      this.newDotSpeed = null;
    },
  },
};
</script>

<style scoped>
  .dot-creator {}

  .form-create-dot .input-container {
    margin-right: 8px;
    float: left;
  }
  .form-create-dot .input-label {
    color: #525252;
    font-size: 12px;
    margin: 6px 4px 0 0;
    text-transform: lowercase;
    float: left;
  }
  .form-create-dot input {
    color: #252525;
    font-size: 14px;
    background-color: transparent;
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom: 1px solid #c9c9c9;
    outline: none;
  }
  .form-create-dot input.input-number {
    text-align: center;
  }
  .form-create-dot details {
    margin-left: 8px;
  }
  .form-create-dot .controls {
    padding: 10px 30px;
  }
</style>
