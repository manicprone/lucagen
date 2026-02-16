<template>
  <div id="app">
    <transition name="fade" appear>
      <div class="page-header">

        <router-link to="/">
          <h1>lucagen</h1>
          <div class="version">{{ webVersion }}</div>
        </router-link>

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
    background-color: #f9f9f9;
    margin: 0;
    color: #252525;
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
    text-decoration: none;
  }
  a:hover {
    color: #111111;
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
    color: #252525;
  }

  .version {
    display: none;
    color: #727272;
    font-size: 10px;
  }

  /* Transitions */
  .fade-slow-enter-active, .fade-slow-leave-active {
    transition: opacity 2s;
  }
  .fade-slow-enter, .fade-slow-leave-to {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .fade-fast-enter-active, .fade-fast-leave-active {
    transition: opacity 0.5s;
  }
  .fade-fast-enter, .fade-fast-leave-to {
    opacity: 0;
  }

  /* Common page elements */
  .page-header {
    background-color: #ededed;
    padding: 7px 0;
    border-bottom: 1px solid #d9d9d9;
  }
  .page-header h1 {
    font-size: 23px;
    line-height: 23px;
  }
  .page-header a:hover {
    color: #676767;
  }

  /* Actions / Controls */
  .action.disabled {
    cursor: not-allowed;
  }
  .action-link.disabled {
    color: #b9b9b9;
  }

  /* Form Styles */
  details {
    font-size: 11px;
    text-align: left;
    color: #727272;
  }
  input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
    color: #c9c9c9;
    text-align: center;
  }
  input::-moz-placeholder { /* Firefox 19+ */
    color: #c9c9c9;
    text-align: center;
  }
  input:-ms-input-placeholder { /* IE 10+ */
    color: #c9c9c9;
    text-align: center;
  }
  input:-moz-placeholder { /* Firefox 18- */
    color: #c9c9c9;
    text-align: center;
  }

  /* Grid System */
  .row {
    clear: both;
    display: block;
    padding: 6px 0;
  }
  .col {
    float: left;
  }
</style>
