<template>
  <div id="app">
    <transition name="fade" appear>
      <div class="page-header">
        <h1>lucagen</h1>
        <div class="version">{{ webVersion }}</div>
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <router-view id="page-content" class="container"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'App',

    computed: {
      webVersion() {
        return this.$store.getters.webVersion;
      },
    },
  };
</script>

<style>
  body {
    background-color: #e9e9e9;
    margin: 0;
  }

  h1, h2 {
    font-weight: normal;
    margin: 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #676767;
    cursor: pointer;
  }
  a:hover {
    color: #252525;
  }
  a.disabled {
    pointer-events: none;
    cursor: not-allowed;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 30px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 2s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .page-header {
    background-color: #ededed;
    padding: 7px 0;
    border-top: 1px solid #e2e2e2;
    border-bottom: 1px solid #e2e2e2;
  }

  .version {
    display: none;
    color: #727272;
    font-size: 10px;
  }

  /* Grid System */
  .container {
  }

  .container .col {
    float: left;
  }
</style>
